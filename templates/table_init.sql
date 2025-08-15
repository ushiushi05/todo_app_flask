-- SQLite
INSERT INTO tasks (user_id, task, is_done, category, priority, date_created) 
VALUES(1, 'Complete the project report', 0, '仕事', 2, '2025-08-10'),
      (1, 'Grocery shopping', 0, '買い物', 3, '2025-08-12'),
      (1, 'Prepare for the meeting', 0, '仕事', 1, '2025-08-13'),
      (1, 'Read a book', 0, '勉強', 3, '2025-08-14'),
      (1, 'Clean the house', 0, '買い物', 2, '2025-08-10'),
      (1, 'Exercise', 0, '勉強', 1, CURRENT_DATE),
      (1, 'Submit the assignment', 0, '仕事', 1, '2025-08-14'),
      (1, 'Call the doctor', 0, '買い物', 2, '2025-08-10'),
      (1, 'Buy groceries', 0, '買い物', 3, CURRENT_DATE),
      (1, 'Attend the seminar', 0, '勉強', 1, '2025-08-13'),
      (1, 'Plan the vacation', 0, 'その他', 2, '2025-08-14'),
      (1, 'Watch a movie', 0, 'その他', 3, CURRENT_DATE);