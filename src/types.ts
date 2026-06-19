export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOption: number; // Index of correct option (0-3)
  points: number;
}

export interface Exam {
  id: string;
  title: string;
  courseCode: string;
  description: string;
  durationMinutes: number;
  questions: Question[];
  scheduledDate: string;
  isActive: boolean;
}

export interface User {
  username: string;
  name: string;
  role: 'student' | 'admin';
  avatar: string;
  department?: string;
  studentId?: string;
}

export interface Attempt {
  id: string;
  studentUsername: string;
  studentName: string;
  examId: string;
  examTitle: string;
  courseCode: string;
  answers: Record<string, number>; // questionId -> chosen index
  flaggedQuestions: string[]; // list of questionIds flagged
  score: number;
  totalPoints: number;
  percent: number;
  correctAnswers: number;
  wrongAnswers: number;
  attemptedCount: number;
  status: 'Pass' | 'Fail';
  grade: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

export interface CollegeStats {
  totalStudents: number;
  activeExams: number;
  examsCompleted: number;
}
