'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Loader2, ChevronLeft } from 'lucide-react';

import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const PHQ9_QUESTIONS = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Type of bad feelings about yourself — or that you are a failure or have let yourself or your family down',
  'Trouble concentrating on things, such as reading the newspaper or watching television',
  'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual',
  'Thoughts that you would be better off dead or of hurting yourself in some way',
];

const DASS21_QUESTIONS = [
  'I found it hard to wind down',
  'I was aware of dryness of my mouth',
  "I couldn't seem to experience any positive feeling at all",
  'I experienced breathing difficulty (e.g. excessively rapid breathing, breathlessness in the absence of physical exertion)',
  'I found it difficult to work up the initiative to do things',
  'I tended to over-react to situations',
  'I experienced trembling (e.g. in the hands)',
  'I felt that I was using a lot of nervous energy',
  'I was worried about situations in which I might panic and make a fool of myself',
  'I felt that I had nothing to look forward to',
  'I found myself getting agitated',
  'I found it difficult to relax',
  'I felt down-hearted and blue',
  'I was intolerant of anything that kept me from getting on with what I was doing',
  'I felt I was close to panic',
  'I was unable to become enthusiastic about anything',
  "I felt I wasn't worth much as a person",
  'I felt that I was rather touchy',
  'I was aware of the action of my heart in the absence of physical exertion (e.g. sense of heart rate increase, heart missing a beat)',
  'I felt scared without any good reason',
  'I felt that life was meaningless',
];

const PHQ9_OPTIONS = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half the days' },
  { value: 3, label: 'Nearly every day' },
];

const DASS21_OPTIONS = [
  { value: 0, label: 'Did not apply to me at all' },
  { value: 1, label: 'Applied to me to some degree, or some of the time' },
  {
    value: 2,
    label: 'Applied to me to a considerable degree or a good part of time',
  },
  { value: 3, label: 'Applied to me very much or most of the time' },
];

const PatientAssessment = () => {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate overall progress across drawings and questionnaires
  // This could be made more sophisticated later
  const [overallProgress, setOverallProgress] = useState(10);

  const handleFinish = () => {
    setIsProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      router.push('/patient/dashboard');
    }, 3000);
  };

  if (isProcessing) {
    return (
      <AppShell title="AI Assessment" description="Processing your inputs...">
        <div className="flex flex-col items-center justify-center space-y-4 py-20 text-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <h2 className="text-xl font-semibold">
            Analyzing your assessment...
          </h2>
          <p className="max-w-md text-muted-foreground">
            Our AI is processing your drawings and questionnaire responses to
            generate a preliminary report for your psychologist.
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="AI Assessment"
      description="Answer a few questions and complete the drawing assessment in a calm space."
    >
      <Card className="mb-6 shadow-soft">
        <CardContent className="space-y-2 pt-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Overall progress</span>
            <span>{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} />
          <p className="text-[11px] text-muted-foreground">
            You can pause at any time and continue later from your dashboard.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="questionnaires" className="space-y-4">
        <TabsList>
          <TabsTrigger value="questionnaires">Questionnaires</TabsTrigger>
          <TabsTrigger value="drawing">Drawing</TabsTrigger>
        </TabsList>

        <TabsContent value="questionnaires" className="space-y-4">
          <AssessmentQuestionnaires onProgressUpdate={setOverallProgress} />
        </TabsContent>
        <TabsContent value="drawing" className="space-y-4">
          <AssessmentDrawing onFinish={handleFinish} />
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end gap-3">
        <Button
          variant="subtle"
          onClick={() => router.push('/patient/dashboard')}
        >
          Save &amp; continue later
        </Button>
      </div>
    </AppShell>
  );
};

const AssessmentQuestionnaires = ({
  onProgressUpdate,
}: {
  onProgressUpdate: (val: number) => void;
}) => {
  const [activeQuestionnaire, setActiveQuestionnaire] = useState<
    'phq9' | 'dass21' | null
  >(null);
  const [phq9Answers, setPhq9Answers] = useState<Record<number, number>>({});
  const [dass21Answers, setDass21Answers] = useState<Record<number, number>>(
    {}
  );

  useEffect(() => {
    // Simple logic to drive the top progress bar based on completion
    let points = 10; // Base points
    if (Object.keys(phq9Answers).length === PHQ9_QUESTIONS.length) points += 30;
    if (Object.keys(dass21Answers).length === DASS21_QUESTIONS.length)
      points += 40;
    // Drawing counts for remaining 20 (not tracked here perfectly but enough for UX)
    onProgressUpdate(points);
  }, [phq9Answers, dass21Answers]);

  const handleComplete = (
    type: 'phq9' | 'dass21',
    answers: Record<number, number>
  ) => {
    if (type === 'phq9') setPhq9Answers(answers);
    if (type === 'dass21') setDass21Answers(answers);
    setActiveQuestionnaire(null);
  };

  if (activeQuestionnaire === 'phq9') {
    return (
      <QuestionnaireForm
        title="PHQ-9"
        description="Patient Health Questionnaire"
        questions={PHQ9_QUESTIONS}
        options={PHQ9_OPTIONS}
        onCancel={() => setActiveQuestionnaire(null)}
        onComplete={(answers) => handleComplete('phq9', answers)}
        initialAnswers={phq9Answers}
      />
    );
  }

  if (activeQuestionnaire === 'dass21') {
    return (
      <QuestionnaireForm
        title="DASS-21"
        description="Depression Anxiety Stress Scales"
        questions={DASS21_QUESTIONS}
        options={DASS21_OPTIONS}
        onCancel={() => setActiveQuestionnaire(null)}
        onComplete={(answers) => handleComplete('dass21', answers)}
        initialAnswers={dass21Answers}
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <QuestionnaireCard
        title="PHQ-9"
        description="Screens for depressive symptoms over the last 2 weeks."
        itemsCompleted={Object.keys(phq9Answers).length}
        totalItems={9}
        onStart={() => setActiveQuestionnaire('phq9')}
      />
      <QuestionnaireCard
        title="DASS-21"
        description="Measures depression, anxiety, and stress in daily life."
        itemsCompleted={Object.keys(dass21Answers).length}
        totalItems={21}
        onStart={() => setActiveQuestionnaire('dass21')}
      />
    </div>
  );
};

interface QuestionnaireFormProps {
  title: string;
  description: string;
  questions: string[];
  options: { value: number; label: string }[];
  onCancel: () => void;
  onComplete: (answers: Record<number, number>) => void;
  initialAnswers: Record<number, number>;
}

const QuestionnaireForm = ({
  title,
  description,
  questions,
  options,
  onCancel,
  onComplete,
  initialAnswers,
}: QuestionnaireFormProps) => {
  const [answers, setAnswers] =
    useState<Record<number, number>>(initialAnswers);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    const firstUnanswered = questions.findIndex(
      (_, idx) => initialAnswers[idx] === undefined
    );
    return firstUnanswered !== -1 ? firstUnanswered : 0;
  });

  const handleAnswer = (value: string) => {
    const numValue = parseInt(value);
    setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: numValue }));
  };

  const completedCount = Object.keys(answers).length;
  const progress = Math.round((completedCount / questions.length) * 100);
  const isComplete = completedCount === questions.length;

  return (
    <Card className="shadow-soft animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 -ml-2"
            onClick={onCancel}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge variant="secondary" className="text-xs font-medium">
            Question {currentQuestionIndex + 1} / {questions.length}
          </Badge>
        </div>
        <Progress value={progress} className="h-1.5" />
      </CardHeader>
      <CardContent className="py-8 min-h-[400px] flex flex-col">
        <div className="flex-1 space-y-8">
          <h3 className="text-xl md:text-2xl font-medium leading-relaxed max-w-2xl">
            {questions[currentQuestionIndex]}
          </h3>

          <RadioGroup
            key={currentQuestionIndex}
            value={answers[currentQuestionIndex]?.toString() ?? ''}
            onValueChange={handleAnswer}
            className="space-y-3 max-w-xl"
          >
            {options.map((option) => (
              <div
                key={option.value}
                className={`
                 flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-all
                 ${
                   answers[currentQuestionIndex] === option.value
                     ? 'bg-primary/5 border-primary shadow-sm ring-1 ring-primary/20'
                     : 'hover:bg-muted/50 hover:border-border/80'
                 }
               `}
              >
                <RadioGroupItem
                  value={option.value.toString()}
                  id={`opt-${option.value}`}
                />
                <Label
                  htmlFor={`opt-${option.value}`}
                  className="flex-1 cursor-pointer font-normal text-base text-foreground/90"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button
            variant="ghost"
            onClick={() =>
              setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
            }
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>

          {isComplete && (
            <Button
              onClick={() => onComplete(answers)}
              className="ml-auto"
              variant="hero"
            >
              Complete Questionnaire
            </Button>
          )}

          {!isComplete && (
            <Button
              variant="outline"
              onClick={() =>
                setCurrentQuestionIndex((prev) =>
                  Math.min(questions.length - 1, prev + 1)
                )
              }
              disabled={answers[currentQuestionIndex] === undefined}
              className="ml-auto"
            >
              Next
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface QuestionnaireCardProps {
  title: string;
  description: string;
  itemsCompleted: number;
  totalItems: number;
  onStart: () => void;
}

const QuestionnaireCard = ({
  title,
  description,
  itemsCompleted,
  totalItems,
  onStart,
}: QuestionnaireCardProps) => {
  const progress = Math.round((itemsCompleted / totalItems) * 100);
  const isComplete = itemsCompleted === totalItems;

  return (
    <Card
      className={`shadow-subtle transition-all duration-300 ${
        isComplete ? 'bg-primary/5 border-primary/20' : ''
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {isComplete && (
            <Badge
              variant="default"
              className="bg-green-600 hover:bg-green-700"
            >
              Completed
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress
            value={progress}
            className={isComplete ? 'bg-green-200' : ''}
          />
        </div>
        <Button
          className="w-full"
          variant={isComplete ? 'outline' : 'hero'}
          size="sm"
          onClick={onStart}
        >
          {itemsCompleted === 0
            ? 'Start Questionnaire'
            : isComplete
            ? 'Review Answers'
            : 'Continue'}
        </Button>
      </CardContent>
    </Card>
  );
};

const AssessmentDrawing = ({ onFinish }: { onFinish: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // Scale context to match
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;

    contextRef.current = ctx;

    // Fill white background (important for saving)
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, rect.width, rect.height);
  }, []);

  const getCoordinates = (event: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = (event as React.MouseEvent).clientX;
      clientY = (event as React.MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
    const { x, y } = getCoordinates(event);
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(event);
    contextRef.current?.lineTo(x, y);
    contextRef.current?.stroke();
  };

  const stopDrawing = () => {
    contextRef.current?.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    // Restore white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, rect.width, rect.height);
  };

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <Card className="h-[450px] shadow-soft flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Drawing canvas</CardTitle>
          <CardDescription>
            Use your mouse or finger to draw your response to the prompt.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0 pb-4">
          <div className="relative flex-1 rounded-xl border border-muted overflow-hidden touch-none bg-white shadow-inner">
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>
          <div className="mt-3 flex justify-between gap-2 text-xs">
            <Button variant="ghost" size="sm" onClick={clearCanvas}>
              Clear &amp; redo
            </Button>
            <Button variant="hero" size="sm" onClick={onFinish}>
              Finish &amp; Analyze
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-subtle h-fit">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-muted-foreground">
          <div>
            <p className="font-medium text-foreground">
              House–Tree–Person (HTP)
            </p>
            <p>
              Draw a house, a tree, and a person. There is no right or wrong
              way.
            </p>
          </div>
          <div>
            <p className="font-medium text-foreground">
              Person Picking an Apple from a Tree (PPAT)
            </p>
            <p>
              Draw a person picking an apple from a tree. Take your time and
              breathe normally.
            </p>
          </div>
          <p>
            These projective drawings help your psychologist better understand
            emotional themes. Only trained professionals interpret them.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientAssessment;
