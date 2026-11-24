const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const LearningContent = require('../models/LearningContent');
const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const Recommendation = require('../models/Recommendation');
const ChatHistory = require('../models/ChatHistory');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Subject.deleteMany({}),
      Topic.deleteMany({}),
      LearningContent.deleteMany({}),
      Quiz.deleteMany({}),
      QuizResult.deleteMany({}),
      Recommendation.deleteMany({}),
      ChatHistory.deleteMany({}),
    ]);
    console.log('Cleared existing collections.');

    // Create Admin and Student users
    const admin = await User.create({
      name: 'Dr. Jane Admin',
      email: 'admin@learning.com',
      password: 'password123',
      role: 'admin',
      learningLevel: 'advanced',
    });

    const student = await User.create({
      name: 'Alex Johnson',
      email: 'student@learning.com',
      password: 'password123',
      role: 'student',
      learningLevel: 'intermediate',
    });

    console.log('Created Admin & Student accounts (Password: password123)');

    // Seed Subjects & Topics
    const subjectsData = [
      {
        name: 'Data Structures & Algorithms',
        description: 'Core concepts of data organization, computational complexity, searching, and sorting.',
        icon: 'Binary',
        color: '#7C3AED',
        difficulty: 'all',
        topics: [
          { name: 'Arrays & Dynamic Sizing', description: 'Contiguous memory structures and amortized operations', difficulty: 'beginner', estimatedTime: 30, tags: ['DSA', 'Arrays'] },
          { name: 'Linked Lists & Pointers', description: 'Node references, singly and doubly linked lists', difficulty: 'beginner', estimatedTime: 40, tags: ['DSA', 'Pointers'] },
          { name: 'Stacks & Queues', description: 'LIFO and FIFO data structures with real-world applications', difficulty: 'beginner', estimatedTime: 35, tags: ['DSA'] },
          { name: 'Binary Trees & Traversals', description: 'Pre-order, In-order, Post-order and Level-order searching', difficulty: 'intermediate', estimatedTime: 50, tags: ['Trees'] },
          { name: 'Graph Algorithms & BFS/DFS', description: 'Shortest path, cycle detection, topological sorting', difficulty: 'advanced', estimatedTime: 60, tags: ['Graphs'] },
          { name: 'Dynamic Programming', description: 'Overlapping subproblems and optimal substructure strategies', difficulty: 'advanced', estimatedTime: 75, tags: ['DP', 'Optimization'] },
        ],
      },
      {
        name: 'Database Management Systems',
        description: 'Relational algebra, SQL, normalization, transactions, and NoSQL architecture.',
        icon: 'Database',
        color: '#2563EB',
        difficulty: 'all',
        topics: [
          { name: 'Relational Model & Keys', description: 'Primary keys, foreign keys, candidate keys, and integrity', difficulty: 'beginner', estimatedTime: 30, tags: ['DBMS', 'Relational'] },
          { name: 'SQL Query Mastery', description: 'Joins, subqueries, group by, aggregations, and window functions', difficulty: 'intermediate', estimatedTime: 45, tags: ['SQL'] },
          { name: 'Database Normalization', description: '1NF, 2NF, 3NF, and BCNF anomaly elimination', difficulty: 'intermediate', estimatedTime: 50, tags: ['Normalization'] },
          { name: 'Transactions & ACID Properties', description: 'Atomicity, Consistency, Isolation, and Durability', difficulty: 'intermediate', estimatedTime: 40, tags: ['Transactions'] },
          { name: 'Indexing & B-Trees', description: 'Clustered vs non-clustered indexes and query optimization', difficulty: 'advanced', estimatedTime: 55, tags: ['Indexing', 'Performance'] },
          { name: 'NoSQL vs RDBMS Architecture', description: 'Document stores, key-value, CAP theorem, and scalability', difficulty: 'intermediate', estimatedTime: 45, tags: ['NoSQL', 'Architecture'] },
        ],
      },
      {
        name: 'Operating Systems',
        description: 'Process management, concurrency, virtual memory, scheduling, and file systems.',
        icon: 'Cpu',
        color: '#059669',
        difficulty: 'all',
        topics: [
          { name: 'Processes & Threads', description: 'PCB, context switching, multitasking, and thread pools', difficulty: 'beginner', estimatedTime: 35, tags: ['OS', 'Processes'] },
          { name: 'CPU Scheduling Algorithms', description: 'FCFS, SJF, Round Robin, and Priority Scheduling', difficulty: 'intermediate', estimatedTime: 45, tags: ['CPU', 'Scheduling'] },
          { name: 'Process Synchronization & Deadlocks', description: 'Semaphores, mutexes, critical sections, and Banker algorithm', difficulty: 'advanced', estimatedTime: 60, tags: ['Deadlocks', 'Concurrency'] },
          { name: 'Virtual Memory & Paging', description: 'Page replacement algorithms (FIFO, LRU, Optimal) and TLB', difficulty: 'intermediate', estimatedTime: 50, tags: ['Memory', 'Paging'] },
        ],
      },
      {
        name: 'Computer Networks',
        description: 'OSI model, TCP/IP, routing protocols, sockets, and web security protocols.',
        icon: 'Network',
        color: '#D97706',
        difficulty: 'all',
        topics: [
          { name: 'OSI vs TCP/IP Models', description: 'Layer responsibilities, encapsulation, and protocol stacks', difficulty: 'beginner', estimatedTime: 30, tags: ['Networking', 'OSI'] },
          { name: 'IP Addressing & Subnetting', description: 'IPv4, IPv6, CIDR notation, and subnet masks', difficulty: 'intermediate', estimatedTime: 50, tags: ['IP', 'Subnetting'] },
          { name: 'Transport Layer: TCP vs UDP', description: 'Three-way handshake, flow control, congestion control', difficulty: 'intermediate', estimatedTime: 40, tags: ['TCP', 'UDP'] },
          { name: 'Application Protocols & Security', description: 'HTTP/HTTPS, DNS, SSL/TLS, and modern firewalls', difficulty: 'intermediate', estimatedTime: 45, tags: ['Security', 'HTTP'] },
        ],
      },
      {
        name: 'Artificial Intelligence & Machine Learning',
        description: 'Supervised and unsupervised learning, neural networks, NLP, and evaluation metrics.',
        icon: 'Sparkles',
        color: '#EC4899',
        difficulty: 'all',
        topics: [
          { name: 'Supervised Learning & Regressions', description: 'Linear, logistic regression, gradient descent mechanics', difficulty: 'beginner', estimatedTime: 40, tags: ['ML', 'Regression'] },
          { name: 'Decision Trees & Ensembles', description: 'Random forests, boosting, bagging, and feature importance', difficulty: 'intermediate', estimatedTime: 50, tags: ['Trees', 'ML'] },
          { name: 'Neural Networks & Deep Learning', description: 'Perceptrons, backpropagation, activation functions', difficulty: 'advanced', estimatedTime: 65, tags: ['Deep Learning', 'AI'] },
          { name: 'Evaluation Metrics & Overfitting', description: 'Confusion matrix, precision, recall, F1-score, ROC-AUC', difficulty: 'intermediate', estimatedTime: 35, tags: ['Metrics'] },
        ],
      },
      {
        name: 'Software Engineering & System Design',
        description: 'Agile methodologies, design patterns, microservices, and scalable architectures.',
        icon: 'Layers',
        color: '#8B5CF6',
        difficulty: 'all',
        topics: [
          { name: 'Software Development Lifecycle (SDLC)', description: 'Waterfall, Agile, Scrum sprints, and CI/CD pipelines', difficulty: 'beginner', estimatedTime: 30, tags: ['SDLC', 'Agile'] },
          { name: 'SOLID Principles & Clean Code', description: 'Single responsibility, Open-closed, Liskov, Interface, Dependency inversion', difficulty: 'intermediate', estimatedTime: 45, tags: ['SOLID', 'OOP'] },
          { name: 'Design Patterns in Practice', description: 'Creational, Structural, and Behavioral patterns (Singleton, Factory, Observer)', difficulty: 'intermediate', estimatedTime: 55, tags: ['Patterns'] },
          { name: 'Microservices & Scalability', description: 'Load balancers, caching, message queues, and API gateways', difficulty: 'advanced', estimatedTime: 60, tags: ['System Design'] },
        ],
      },
    ];

    for (const sub of subjectsData) {
      const createdSubject = await Subject.create({
        name: sub.name,
        description: sub.description,
        icon: sub.icon,
        color: sub.color,
        difficulty: sub.difficulty,
        createdBy: admin._id,
      });

      const topicIds = [];
      for (const top of sub.topics) {
        const createdTopic = await Topic.create({
          ...top,
          subject: createdSubject._id,
        });
        topicIds.push(createdTopic._id);
      }

      createdSubject.topics = topicIds;
      await createdSubject.save();
    }

    console.log(`Seeded ${subjectsData.length} subjects with comprehensive topics.`);

    // Create a sample completed quiz & result for student to display stats immediately
    const firstSubject = await Subject.findOne({ name: 'Data Structures & Algorithms' });
    const firstTopic = await Topic.findOne({ subject: firstSubject._id });

    if (firstSubject && firstTopic) {
      const sampleQuiz = await Quiz.create({
        student: student._id,
        subject: firstSubject._id,
        topic: firstTopic._id,
        difficulty: 'beginner',
        numQuestions: 5,
        questions: [
          {
            question: 'What is the time complexity to access an element by index in an array?',
            options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
            correctAnswer: 0,
            explanation: 'Arrays store elements in contiguous memory slots, allowing constant time direct index calculations.',
          },
          {
            question: 'What is the worst-case insertion time for dynamic arrays when resizing occurs?',
            options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
            correctAnswer: 1,
            explanation: 'When full, a dynamic array must allocate a larger block and copy all existing elements, taking O(n) time.',
          },
          {
            question: 'What is the amortized time complexity for append in a dynamic array?',
            options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
            correctAnswer: 0,
            explanation: 'Because resizes occur exponentially infrequently (doubling), the average time per append is O(1).',
          },
          {
            question: 'Which operation is O(1) in a standard array?',
            options: ['Insert at index 0', 'Delete at index 0', 'Access by index', 'Search for a non-sorted value'],
            correctAnswer: 2,
            explanation: 'Access by index is instant O(1) through pointer arithmetic.',
          },
          {
            question: 'What memory layout do native arrays use?',
            options: ['Contiguous memory allocation', 'Fragmented linked chunks', 'Random non-sequential pages', 'Distributed cloud storage'],
            correctAnswer: 0,
            explanation: 'Arrays require contiguous blocks of memory for direct offset addressing.',
          },
        ],
      });

      await QuizResult.create({
        student: student._id,
        quiz: sampleQuiz._id,
        subject: firstSubject._id,
        topic: firstTopic._id,
        score: 80,
        totalQuestions: 5,
        timeTaken: 120,
        answers: [
          { questionIndex: 0, selectedAnswer: 0, isCorrect: true },
          { questionIndex: 1, selectedAnswer: 1, isCorrect: true },
          { questionIndex: 2, selectedAnswer: 0, isCorrect: true },
          { questionIndex: 3, selectedAnswer: 2, isCorrect: true },
          { questionIndex: 4, selectedAnswer: 1, isCorrect: false },
        ],
      });

      // Sample recommendation
      await Recommendation.create({
        student: student._id,
        recommendations: [
          {
            subject: firstSubject._id,
            topic: firstTopic._id,
            reason: 'Review memory layouts and cache locality to achieve 100% mastery in Arrays.',
            priority: 'medium',
            type: 'review',
          },
        ],
      });

      console.log('Seeded sample quiz, result, and recommendation for Alex Johnson.');
    }

    console.log('✅ Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

seedData();
