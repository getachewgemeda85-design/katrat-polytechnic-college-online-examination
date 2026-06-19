import { Exam, Question, User, Attempt, Notification } from '../types';

export const SAMPLE_QUESTIONS_DS_ALGO: Question[] = [
  {
    id: 'ds1',
    text: 'Which data structure works on the LIFO (Last In First Out) principle?',
    options: ['Queue', 'Stack', 'Linked List', 'Binary Tree'],
    correctOption: 1,
    points: 5,
  },
  {
    id: 'ds2',
    text: 'What is the worst-case time complexity of searching in a Hash Table?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctOption: 2,
    points: 5,
  },
  {
    id: 'ds3',
    text: 'Which graph traversal algorithm uses a Queue as its core helper data structure?',
    options: ['Breadth First Search (BFS)', 'Depth First Search (DFS)', 'Dijkstra\'s Algorithm', 'Kruskal\'s Algorithm'],
    correctOption: 0,
    points: 5,
  },
  {
    id: 'ds4',
    text: 'A binary tree in which every level, except possibly the last, is completely filled, is called a...',
    options: ['Full Binary Tree', 'Perfect Binary Tree', 'Complete Binary Tree', 'Degenerate Tree'],
    correctOption: 2,
    points: 5,
  },
  {
    id: 'ds5',
    text: 'What algorithm is primarily used to find the shortest path in a weighted graph with non-negative path weights?',
    options: ['Prim\'s Algorithm', 'Floyd-Warshall Algorithm', 'Bellman-Ford Algorithm', 'Dijkstra\'s Algorithm'],
    correctOption: 3,
    points: 5,
  },
  {
    id: 'ds6',
    text: 'Which sorting algorithm has a worst-case time complexity of O(n^2) but is extremely fast in practice for nearly sorted files?',
    options: ['Quick Sort', 'Merge Sort', 'Insertion Sort', 'Heap Sort'],
    correctOption: 2,
    points: 5,
  },
  {
    id: 'ds7',
    text: 'What is the balance factor of an AVL tree node defined as?',
    options: [
      'Height(Left Subtree) - Height(Right Subtree)',
      'Height(Left Subtree) * Height(Right Subtree)',
      'Height(Right Subtree) / Height(Left Subtree)',
      'Total Nodes in Left Subtree - Total Nodes in Right Subtree'
    ],
    correctOption: 0,
    points: 5,
  },
  {
    id: 'ds8',
    text: 'Which tree structure is optimized for disk read/write operations and heavily utilized in modern relational database indexes?',
    options: ['Binary Search Tree', 'AVL Tree', 'B+ Tree', 'Red-Black Tree'],
    correctOption: 2,
    points: 5,
  },
  {
    id: 'ds9',
    text: 'What does a circular queue resolve compared to a standard linear queue array representation?',
    options: ['Queue Overflow', 'Underflow', 'Memory wastage (unused spaces at front)', 'Infinite execution loop'],
    correctOption: 2,
    points: 5,
  },
  {
    id: 'ds10',
    text: 'What is the time complexity of building a heap with n elements using the bottom-up heapify approach?',
    options: ['O(n log n)', 'O(n)', 'O(log n)', 'O(n^2)'],
    correctOption: 1,
    points: 5,
  }
];

export const SAMPLE_QUESTIONS_DB_WEB: Question[] = [
  {
    id: 'db1',
    text: 'Which division represents the "C" in acid properties of database transactions?',
    options: ['Consistency', 'Concurrency', 'Commitment', 'Caching'],
    correctOption: 0,
    points: 5,
  },
  {
    id: 'db2',
    text: 'In relational algebra, which symbol is used to denote the selection operation?',
    options: ['π (Pi)', 'σ (Sigma)', 'ρ (Rho)', '⨝ (Join)'],
    correctOption: 1,
    points: 5,
  },
  {
    id: 'db3',
    text: 'Which SQL join clause returns all records from the left table and matching records from the right table, with nulls if no match exists?',
    options: ['INNER JOIN', 'RIGHT JOIN', 'CROSS JOIN', 'LEFT JOIN'],
    correctOption: 3,
    points: 5,
  },
  {
    id: 'db4',
    text: 'Which HTTP response code corresponds to "401 Unauthorized"?',
    options: ['Forbidden access', 'Authentication is required and has failed or is missing', 'Resource not found', 'Method not allowed'],
    correctOption: 1,
    points: 5,
  },
  {
    id: 'db5',
    text: 'In the OSI network model, which layer deals with routing packets across different network hops?',
    options: ['Data Link Layer', 'Transport Layer', 'Network Layer', 'Physical Layer'],
    correctOption: 2,
    points: 5,
  },
  {
    id: 'db6',
    text: 'Which protocol operates on Port 443 by default?',
    options: ['HTTP', 'HTTPS', 'SSH', 'FTP'],
    correctOption: 1,
    points: 5,
  },
  {
    id: 'db7',
    text: 'In database systems, a foreign key constraint maintains...',
    options: ['Entity Integrity', 'Domain Integrity', 'Referential Integrity', 'User-defined Integrity'],
    correctOption: 2,
    points: 5,
  },
  {
    id: 'db8',
    text: 'Which normal form is concerned with removing partial functional dependencies to ensure attributes rely purely on the full composite primary key?',
    options: ['First Normal Form (1NF)', 'Second Normal Form (2NF)', 'Third Normal Form (3NF)', 'Boyce-Codd Normal Form (BCNF)'],
    correctOption: 1,
    points: 5,
  },
  {
    id: 'db9',
    text: 'Which of the following is NOT a fundamental feature of the REST architectural style for web resources?',
    options: ['Statellessness', 'Cacheable response', 'Uniform Interface', 'Keep-alive persistent TCP statefulness'],
    correctOption: 3,
    points: 5,
  },
  {
    id: 'db10',
    text: 'What is the primary function of a domain name system (DNS)?',
    options: [
      'Encrypt browser payload',
      'Resolve user-friendly domain names to numeric IP addresses',
      'Act as a firewall gatekeeper',
      'Load-balance HTTP instances'
    ],
    correctOption: 1,
    points: 5,
  }
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'exam-1',
    title: 'Computer Science: Advanced Data Structures & Algorithms',
    courseCode: 'CS-301',
    description: 'A comprehensive mid-term theory assessment covering stack structures, hashing collisions, BFS/DFS complexities, AVL trees, and sorting optimizations.',
    durationMinutes: 15,
    questions: SAMPLE_QUESTIONS_DS_ALGO,
    scheduledDate: '2026-06-25T10:00:00',
    isActive: true,
  },
  {
    id: 'exam-2',
    title: 'Computer Science: Relational DBMS & Web Architecture',
    courseCode: 'CS-302',
    description: 'Analytical evaluation focusing on database normalization, select algebraic relational symbols, HTTP request layers, and referential constraints.',
    durationMinutes: 15,
    questions: SAMPLE_QUESTIONS_DB_WEB,
    scheduledDate: '2026-06-26T14:30:00',
    isActive: true,
  }
];

export const SAMPLE_USERS: User[] = [
  {
    username: 'student',
    name: 'Aron Mukerji',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    department: 'Computer Technology Department',
    studentId: 'KPC-2026-CS-084',
  },
  {
    username: 'admin',
    name: 'Prof. Helen Roberts',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    department: 'Examination Control Board',
  }
];

export const INITIAL_ATTEMPTS: Attempt[] = [
  {
    id: 'att-1',
    studentUsername: 'student',
    studentName: 'Aron Mukerji',
    examId: 'exam-1',
    examTitle: 'Computer Science: Advanced Data Structures & Algorithms',
    courseCode: 'CS-301',
    answers: {
      'ds1': 1, // correct
      'ds2': 1, // incorrect (correct is O(n) which is index 2)
      'ds3': 0, // correct
      'ds4': 2, // correct
      'ds5': 3, // correct
      'ds6': 2, // correct
      'ds7': 0, // correct
      'ds8': 2, // correct
      'ds9': 2, // correct
      'ds10': 0, // incorrect (correct is O(n) which is index 1)
    },
    flaggedQuestions: [],
    score: 40,
    totalPoints: 50,
    percent: 80,
    correctAnswers: 8,
    wrongAnswers: 2,
    attemptedCount: 10,
    status: 'Pass',
    grade: 'A',
    timestamp: '2026-06-18T10:15:22-07:00',
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'New Exam Published',
    message: 'The mid-term examination "CS-302: Relational DBMS & Web Architecture" is now open for review and scheduling.',
    time: '2 hours ago',
    read: false,
    type: 'success',
  },
  {
    id: 'n2',
    title: 'System Maintenance Window',
    message: 'The examination servers will undergo security compliance upgrades at 01:00 AM UTC. Plan your sessions accordingly.',
    time: '1 day ago',
    read: true,
    type: 'warning',
  },
  {
    id: 'n3',
    title: 'CS-301 Evaluation Released',
    message: 'Grading metrics for CS-301 Mid-term are completed. Check your score summary in your results tab.',
    time: '2 days ago',
    read: true,
    type: 'info',
  }
];
