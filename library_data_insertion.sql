-- Library Management System - Data Insertion Script
-- This script contains INSERT statements for all tables with 40 books and related data

USE databasetest1;

-- Insert Authors
INSERT INTO authors (name, bio, nationality) VALUES
('J.K. Rowling', 'British author best known for the Harry Potter series', 'British'),
('George Orwell', 'English novelist and essayist, journalist and critic', 'British'),
('Harper Lee', 'American novelist widely known for To Kill a Mockingbird', 'American'),
('F. Scott Fitzgerald', 'American novelist and short story writer', 'American'),
('Jane Austen', 'English novelist known for her wit and social commentary', 'British'),
('Mark Twain', 'American writer, humorist, entrepreneur, publisher, and lecturer', 'American'),
('Charles Dickens', 'English writer and social critic', 'British'),
('William Shakespeare', 'English playwright, poet, and actor', 'British'),
('Ernest Hemingway', 'American novelist, short-story writer, and journalist', 'American'),
('Agatha Christie', 'English writer known for her detective novels', 'British'),
('Stephen King', 'American author of horror, supernatural fiction, suspense, crime, science-fiction, and fantasy novels', 'American'),
('Dan Brown', 'American author best known for his thriller novels', 'American'),
('Paulo Coelho', 'Brazilian lyricist and novelist', 'Brazilian'),
('Khaled Hosseini', 'Afghan-American novelist and physician', 'Afghan-American'),
('Suzanne Collins', 'American television writer and author', 'American'),
('John Green', 'American author and YouTube content creator', 'American'),
('Gillian Flynn', 'American author, screenwriter, and critic', 'American'),
('Toni Morrison', 'American novelist, essayist, book editor, and college professor', 'American'),
('Maya Angelou', 'American poet, memoirist, and civil rights activist', 'American'),
('Gabriel García Márquez', 'Colombian novelist, short-story writer, screenwriter, and journalist', 'Colombian'),
('Leo Tolstoy', 'Russian writer who is regarded as one of the greatest authors of all time', 'Russian'),
('Fyodor Dostoevsky', 'Russian novelist, philosopher, short story writer, essayist, and journalist', 'Russian'),
('Victor Hugo', 'French poet, novelist, and dramatist of the Romantic movement', 'French'),
('Charlotte Brontë', 'English novelist and poet', 'British'),
('Emily Brontë', 'English novelist and poet', 'British'),
('Oscar Wilde', 'Irish poet and playwright', 'Irish'),
('Arthur Conan Doyle', 'British writer and physician', 'British'),
('Jules Verne', 'French novelist, poet, and playwright', 'French'),
('H.G. Wells', 'English writer', 'British'),
('Aldous Huxley', 'English writer and philosopher', 'British');

-- Insert Publishers
INSERT INTO publisher (name, address, contact_info) VALUES
('Bloomsbury Publishing', 'London, UK', 'contact@bloomsbury.com'),
('Penguin Random House', 'New York, USA', 'info@penguinrandomhouse.com'),
('HarperCollins', 'New York, USA', 'contact@harpercollins.com'),
('Simon & Schuster', 'New York, USA', 'info@simonandschuster.com'),
('Macmillan Publishers', 'London, UK', 'contact@macmillan.com'),
('Hachette Book Group', 'New York, USA', 'info@hachette.com'),
('Scholastic Corporation', 'New York, USA', 'contact@scholastic.com'),
('Oxford University Press', 'Oxford, UK', 'info@oup.com'),
('Cambridge University Press', 'Cambridge, UK', 'contact@cambridge.org'),
('Vintage Books', 'New York, USA', 'info@vintage.com'),
('Doubleday', 'New York, USA', 'contact@doubleday.com'),
('Bantam Books', 'New York, USA', 'info@bantam.com'),
('Faber & Faber', 'London, UK', 'contact@faber.co.uk'),
('Knopf', 'New York, USA', 'info@knopf.com'),
('Little, Brown and Company', 'Boston, USA', 'contact@littlebrown.com');

-- Insert Categories
INSERT INTO categories (name, description) VALUES
('Fiction', 'Literary works of imaginative narration'),
('Mystery', 'Stories involving puzzling crimes or unexplained events'),
('Romance', 'Stories focusing on love relationships'),
('Science Fiction', 'Fiction dealing with futuristic concepts'),
('Fantasy', 'Fiction involving magical or supernatural elements'),
('Horror', 'Fiction intended to frighten, unsettle, or create suspense'),
('Thriller', 'Fast-paced fiction with constant danger'),
('Biography', 'Account of someone\'s life written by someone else'),
('History', 'Study of past events'),
('Philosophy', 'Study of fundamental questions about existence'),
('Poetry', 'Literary work expressing feelings and ideas'),
('Drama', 'Literature intended for performance'),
('Adventure', 'Exciting stories with journeys and quests'),
('Crime', 'Stories involving criminal activities'),
('Literary Fiction', 'Character-driven fiction with artistic merit'),
('Young Adult', 'Fiction targeted at teenage readers'),
('Children', 'Books written specifically for children'),
('Classic', 'Literature of recognized and established value'),
('Contemporary', 'Modern literature reflecting current times'),
('Historical Fiction', 'Fiction set in the past');

-- Insert Books (40 books)
INSERT INTO books (title, isbn, author_id, publisher_id) VALUES
('Harry Potter and the Philosopher\'s Stone', '978-0747532699', 1, 1),
('Harry Potter and the Chamber of Secrets', '978-0747538493', 1, 1),
('Harry Potter and the Prisoner of Azkaban', '978-0747542155', 1, 1),
('1984', '978-0451524935', 2, 2),
('Animal Farm', '978-0451526342', 2, 2),
('To Kill a Mockingbird', '978-0061120084', 3, 3),
('The Great Gatsby', '978-0743273565', 4, 4),
('Pride and Prejudice', '978-0141439518', 5, 2),
('Sense and Sensibility', '978-0141439662', 5, 2),
('The Adventures of Tom Sawyer', '978-0486400778', 6, 5),
('The Adventures of Huckleberry Finn', '978-0486280615', 6, 5),
('A Tale of Two Cities', '978-0486406510', 7, 2),
('Great Expectations', '978-0486415864', 7, 2),
('Romeo and Juliet', '978-0486275437', 8, 8),
('Hamlet', '978-0486272788', 8, 8),
('The Old Man and the Sea', '978-0684801223', 9, 4),
('A Farewell to Arms', '978-0684837888', 9, 4),
('Murder on the Orient Express', '978-0062693662', 10, 3),
('And Then There Were None', '978-0062073488', 10, 3),
('The Shining', '978-0307743657', 11, 11),
('It', '978-1501142970', 11, 11),
('The Da Vinci Code', '978-0307474278', 12, 11),
('Angels and Demons', '978-0671027360', 12, 4),
('The Alchemist', '978-0062315007', 13, 3),
('The Kite Runner', '978-1594631931', 14, 6),
('A Thousand Splendid Suns', '978-1594489501', 14, 6),
('The Hunger Games', '978-0439023528', 15, 7),
('Catching Fire', '978-0439023498', 15, 7),
('The Fault in Our Stars', '978-0142424179', 16, 2),
('Looking for Alaska', '978-0142402511', 16, 2),
('Gone Girl', '978-0307588371', 17, 10),
('Beloved', '978-1400033416', 18, 10),
('I Know Why the Caged Bird Sings', '978-0345514400', 19, 12),
('One Hundred Years of Solitude', '978-0060883287', 20, 3),
('War and Peace', '978-0199232765', 21, 8),
('Crime and Punishment', '978-0486415871', 22, 5),
('Les Misérables', '978-0451419439', 23, 2),
('Jane Eyre', '978-0141441146', 24, 2),
('Wuthering Heights', '978-0141439556', 25, 2),
('The Picture of Dorian Gray', '978-0486278070', 26, 5);

-- Insert Books_Categories relationships (Many-to-Many)
INSERT INTO books_categories (book_id, category_id) VALUES
-- Harry Potter series - Fantasy, Young Adult
(1, 5), (1, 16),
(2, 5), (2, 16),
(3, 5), (3, 16),
-- Orwell books - Fiction, Classic
(4, 1), (4, 18),
(5, 1), (5, 18),
-- To Kill a Mockingbird - Fiction, Classic
(6, 1), (6, 18),
-- The Great Gatsby - Fiction, Classic
(7, 1), (7, 18),
-- Jane Austen - Romance, Classic
(8, 3), (8, 18),
(9, 3), (9, 18),
-- Mark Twain - Adventure, Classic
(10, 13), (10, 18),
(11, 13), (11, 18),
-- Dickens - Fiction, Classic
(12, 1), (12, 18),
(13, 1), (13, 18),
-- Shakespeare - Drama, Classic
(14, 12), (14, 18),
(15, 12), (15, 18),
-- Hemingway - Fiction, Classic
(16, 1), (16, 18),
(17, 1), (17, 18),
-- Agatha Christie - Mystery, Crime
(18, 2), (18, 14),
(19, 2), (19, 14),
-- Stephen King - Horror, Thriller
(20, 6), (20, 7),
(21, 6), (21, 7),
-- Dan Brown - Thriller, Mystery
(22, 7), (22, 2),
(23, 7), (23, 2),
-- Paulo Coelho - Fiction, Philosophy
(24, 1), (24, 10),
-- Khaled Hosseini - Fiction, Historical Fiction
(25, 1), (25, 20),
(26, 1), (26, 20),
-- Hunger Games - Science Fiction, Young Adult
(27, 4), (27, 16),
(28, 4), (28, 16),
-- John Green - Young Adult, Romance
(29, 16), (29, 3),
(30, 16), (30, 3),
-- Gone Girl - Thriller, Crime
(31, 7), (31, 14),
-- Toni Morrison - Literary Fiction, Classic
(32, 15), (32, 18),
-- Maya Angelou - Biography, Classic
(33, 8), (33, 18),
-- Gabriel García Márquez - Literary Fiction, Classic
(34, 15), (34, 18),
-- Tolstoy - Classic, Historical Fiction
(35, 18), (35, 20),
-- Dostoevsky - Classic, Philosophy
(36, 18), (36, 10),
-- Victor Hugo - Classic, Historical Fiction
(37, 18), (37, 20),
-- Brontë sisters - Romance, Classic
(38, 3), (38, 18),
(39, 3), (39, 18),
-- Oscar Wilde - Classic, Fiction
(40, 18), (40, 1);

-- Insert Copies (multiple copies for each book)
INSERT INTO copies (book_id, copy_number, status, location) VALUES
-- Harry Potter series (multiple copies)
(1, 1, 'Available', 'Fiction Section - Shelf A1'), (1, 2, 'Available', 'Fiction Section - Shelf A1'), (1, 3, 'Borrowed', 'Checked Out'),
(2, 1, 'Available', 'Fiction Section - Shelf A1'), (2, 2, 'Available', 'Fiction Section - Shelf A1'),
(3, 1, 'Available', 'Fiction Section - Shelf A1'), (3, 2, 'Borrowed', 'Checked Out'),
-- Classic Literature
(4, 1, 'Available', 'Classic Section - Shelf B1'), (4, 2, 'Available', 'Classic Section - Shelf B1'), (4, 3, 'Available', 'Classic Section - Shelf B1'),
(5, 1, 'Available', 'Classic Section - Shelf B1'), (5, 2, 'Available', 'Classic Section - Shelf B1'),
(6, 1, 'Available', 'Classic Section - Shelf B2'), (6, 2, 'Available', 'Classic Section - Shelf B2'), (6, 3, 'Borrowed', 'Checked Out'),
(7, 1, 'Available', 'Classic Section - Shelf B2'), (7, 2, 'Available', 'Classic Section - Shelf B2'),
(8, 1, 'Available', 'Romance Section - Shelf C1'), (8, 2, 'Available', 'Romance Section - Shelf C1'),
(9, 1, 'Available', 'Romance Section - Shelf C1'), (9, 2, 'Available', 'Romance Section - Shelf C1'),
(10, 1, 'Available', 'Adventure Section - Shelf D1'), (10, 2, 'Available', 'Adventure Section - Shelf D1'),
(11, 1, 'Available', 'Adventure Section - Shelf D1'), (11, 2, 'Borrowed', 'Checked Out'),
(12, 1, 'Available', 'Classic Section - Shelf B3'), (12, 2, 'Available', 'Classic Section - Shelf B3'),
(13, 1, 'Available', 'Classic Section - Shelf B3'), (13, 2, 'Available', 'Classic Section - Shelf B3'),
(14, 1, 'Available', 'Drama Section - Shelf E1'), (14, 2, 'Available', 'Drama Section - Shelf E1'), (14, 3, 'Available', 'Drama Section - Shelf E1'),
(15, 1, 'Available', 'Drama Section - Shelf E1'), (15, 2, 'Available', 'Drama Section - Shelf E1'),
(16, 1, 'Available', 'Classic Section - Shelf B4'), (16, 2, 'Available', 'Classic Section - Shelf B4'),
(17, 1, 'Available', 'Classic Section - Shelf B4'), (17, 2, 'Borrowed', 'Checked Out'),
(18, 1, 'Available', 'Mystery Section - Shelf F1'), (18, 2, 'Available', 'Mystery Section - Shelf F1'), (18, 3, 'Available', 'Mystery Section - Shelf F1'),
(19, 1, 'Available', 'Mystery Section - Shelf F1'), (19, 2, 'Available', 'Mystery Section - Shelf F1'),
(20, 1, 'Available', 'Horror Section - Shelf G1'), (20, 2, 'Available', 'Horror Section - Shelf G1'),
(21, 1, 'Available', 'Horror Section - Shelf G1'), (21, 2, 'Borrowed', 'Checked Out'),
(22, 1, 'Available', 'Thriller Section - Shelf H1'), (22, 2, 'Available', 'Thriller Section - Shelf H1'), (22, 3, 'Available', 'Thriller Section - Shelf H1'),
(23, 1, 'Available', 'Thriller Section - Shelf H1'), (23, 2, 'Available', 'Thriller Section - Shelf H1'),
(24, 1, 'Available', 'Philosophy Section - Shelf I1'), (24, 2, 'Available', 'Philosophy Section - Shelf I1'),
(25, 1, 'Available', 'Fiction Section - Shelf A2'), (25, 2, 'Available', 'Fiction Section - Shelf A2'), (25, 3, 'Borrowed', 'Checked Out'),
(26, 1, 'Available', 'Fiction Section - Shelf A2'), (26, 2, 'Available', 'Fiction Section - Shelf A2'),
(27, 1, 'Available', 'Young Adult Section - Shelf J1'), (27, 2, 'Available', 'Young Adult Section - Shelf J1'), (27, 3, 'Available', 'Young Adult Section - Shelf J1'),
(28, 1, 'Available', 'Young Adult Section - Shelf J1'), (28, 2, 'Borrowed', 'Checked Out'),
(29, 1, 'Available', 'Young Adult Section - Shelf J2'), (29, 2, 'Available', 'Young Adult Section - Shelf J2'),
(30, 1, 'Available', 'Young Adult Section - Shelf J2'), (30, 2, 'Available', 'Young Adult Section - Shelf J2'),
(31, 1, 'Available', 'Thriller Section - Shelf H2'), (31, 2, 'Available', 'Thriller Section - Shelf H2'),
(32, 1, 'Available', 'Literary Fiction - Shelf K1'), (32, 2, 'Available', 'Literary Fiction - Shelf K1'),
(33, 1, 'Available', 'Biography Section - Shelf L1'), (33, 2, 'Available', 'Biography Section - Shelf L1'),
(34, 1, 'Available', 'Literary Fiction - Shelf K2'), (34, 2, 'Available', 'Literary Fiction - Shelf K2'),
(35, 1, 'Available', 'Classic Section - Shelf B5'), (35, 2, 'Available', 'Classic Section - Shelf B5'), (35, 3, 'Borrowed', 'Checked Out'),
(36, 1, 'Available', 'Classic Section - Shelf B5'), (36, 2, 'Available', 'Classic Section - Shelf B5'),
(37, 1, 'Available', 'Classic Section - Shelf B6'), (37, 2, 'Available', 'Classic Section - Shelf B6'),
(38, 1, 'Available', 'Romance Section - Shelf C2'), (38, 2, 'Available', 'Romance Section - Shelf C2'),
(39, 1, 'Available', 'Romance Section - Shelf C2'), (39, 2, 'Borrowed', 'Checked Out'),
(40, 1, 'Available', 'Classic Section - Shelf B6'), (40, 2, 'Available', 'Classic Section - Shelf B6');

-- Display summary of inserted data
SELECT 'Data Insertion Complete!' as Status;
SELECT COUNT(*) as 'Total Authors' FROM authors;
SELECT COUNT(*) as 'Total Publishers' FROM publisher;
SELECT COUNT(*) as 'Total Categories' FROM categories;
SELECT COUNT(*) as 'Total Books' FROM books;
SELECT COUNT(*) as 'Total Book Copies' FROM copies;
SELECT COUNT(*) as 'Total Book-Category Relationships' FROM books_categories;



