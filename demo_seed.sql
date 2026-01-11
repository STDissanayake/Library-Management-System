START TRANSACTION;

INSERT INTO authors (name, bio, nationality)
SELECT * FROM (
  SELECT 'Arthur C. Clarke', 'British science fiction writer, futurist, and inventor.', 'British'
  UNION ALL SELECT 'Isaac Asimov', 'Russian-American writer and professor of biochemistry, known for hard science fiction.', 'American'
  UNION ALL SELECT 'Frank Herbert', 'American science-fiction author best known for Dune.', 'American'
  UNION ALL SELECT 'George Orwell', 'English novelist and essayist, journalist and critic.', 'British'
  UNION ALL SELECT 'J.K. Rowling', 'British author best known for the Harry Potter series.', 'British'
  UNION ALL SELECT 'Agatha Christie', 'English writer known for detective novels and short stories.', 'British'
  UNION ALL SELECT 'Stephen King', 'American author of horror and suspense novels.', 'American'
  UNION ALL SELECT 'Jane Austen', 'English novelist known for wit and social commentary.', 'British'
  UNION ALL SELECT 'Mark Twain', 'American writer, humorist, and lecturer.', 'American'
  UNION ALL SELECT 'Harper Lee', 'American novelist widely known for To Kill a Mockingbird.', 'American'
  UNION ALL SELECT 'F. Scott Fitzgerald', 'American novelist and short story writer.', 'American'
  UNION ALL SELECT 'Charles Dickens', 'English writer and social critic.', 'British'
  UNION ALL SELECT 'H.G. Wells', 'English writer, prolific in many genres, especially science fiction.', 'British'
  UNION ALL SELECT 'Aldous Huxley', 'English writer and philosopher, author of Brave New World.', 'British'
  UNION ALL SELECT 'Jules Verne', 'French novelist, poet, and playwright; pioneer of science fiction.', 'French'
  UNION ALL SELECT 'Arthur Conan Doyle', 'British writer and physician; creator of Sherlock Holmes.', 'British'
  UNION ALL SELECT 'Gabriel García Márquez', 'Colombian novelist and Nobel laureate; magical realism.', 'Colombian'
  UNION ALL SELECT 'Leo Tolstoy', 'Russian writer regarded as one of the greatest of all time.', 'Russian'
  UNION ALL SELECT 'Fyodor Dostoevsky', 'Russian novelist and philosopher.', 'Russian'
  UNION ALL SELECT 'Victor Hugo', 'French poet, novelist, and dramatist.', 'French'
) AS v(name, bio, nationality)
WHERE NOT EXISTS (
  SELECT 1 FROM authors a WHERE a.name = v.name
);

INSERT INTO publishers (name, address, contact_info)
SELECT * FROM (
  SELECT 'Penguin Random House', 'New York, USA', 'info@penguinrandomhouse.com'
  UNION ALL SELECT 'HarperCollins', 'New York, USA', 'contact@harpercollins.com'
  UNION ALL SELECT 'Bloomsbury Publishing', 'London, UK', 'contact@bloomsbury.com'
  UNION ALL SELECT 'Simon & Schuster', 'New York, USA', 'info@simonandschuster.com'
  UNION ALL SELECT 'Macmillan Publishers', 'London, UK', 'contact@macmillan.com'
  UNION ALL SELECT 'Oxford University Press', 'Oxford, UK', 'info@oup.com'
  UNION ALL SELECT 'Vintage Books', 'New York, USA', 'info@vintage.com'
  UNION ALL SELECT 'Doubleday', 'New York, USA', 'contact@doubleday.com'
  UNION ALL SELECT 'Bantam Books', 'New York, USA', 'info@bantam.com'
  UNION ALL SELECT 'Cambridge University Press', 'Cambridge, UK', 'contact@cambridge.org'
) AS v(name, address, contact_info)
WHERE NOT EXISTS (
  SELECT 1 FROM publishers p WHERE p.name = v.name
);

INSERT INTO books (
  title,
  isbn,
  publication_date,
  category,
  status,
  total_copies,
  available_copies,
  author_id,
  publisher_id
)
SELECT * FROM (
  SELECT
    '2001: A Space Odyssey' AS title,
    '978-0451457998' AS isbn,
    '1968-07-01' AS publication_date,
    'Science Fiction' AS category,
    'Available' AS status,
    8 AS total_copies,
    8 AS available_copies,
    (SELECT id FROM authors WHERE name = 'Arthur C. Clarke' LIMIT 1) AS author_id,
    (SELECT id FROM publishers WHERE name = 'Penguin Random House' LIMIT 1) AS publisher_id
  UNION ALL SELECT
    'Childhood''s End',
    '978-0345347954',
    '1953-08-01',
    'Science Fiction',
    'Available',
    6,
    6,
    (SELECT id FROM authors WHERE name = 'Arthur C. Clarke' LIMIT 1),
    (SELECT id FROM publishers WHERE name = 'HarperCollins' LIMIT 1)
  UNION ALL SELECT
    'I, Robot',
    '978-0553382563',
    '1950-12-02',
    'Science Fiction',
    'Available',
    7,
    7,
    (SELECT id FROM authors WHERE name = 'Isaac Asimov' LIMIT 1),
    (SELECT id FROM publishers WHERE name = 'Bantam Books' LIMIT 1)
  UNION ALL SELECT
    'Foundation',
    '978-0553293357',
    '1951-06-01',
    'Science Fiction',
    'Available',
    7,
    7,
    (SELECT id FROM authors WHERE name = 'Isaac Asimov' LIMIT 1),
    (SELECT id FROM publishers WHERE name = 'Doubleday' LIMIT 1)
  UNION ALL SELECT
    'Dune',
    '978-0441172719',
    '1965-08-01',
    'Science Fiction',
    'Available',
    10,
    10,
    (SELECT id FROM authors WHERE name = 'Frank Herbert' LIMIT 1),
    (SELECT id FROM publishers WHERE name = 'Penguin Random House' LIMIT 1)
  UNION ALL SELECT
    '1984',
    '978-0451524935',
    '1949-06-08',
    'Dystopian',
    'Available',
    12,
    12,
    (SELECT id FROM authors WHERE name = 'George Orwell' LIMIT 1),
    (SELECT id FROM publishers WHERE name = 'Penguin Random House' LIMIT 1)
  UNION ALL SELECT
    'Animal Farm',
    '978-0451526342',
    '1945-08-17',
    'Political Satire',
    'Available',
    12,
    12,
    (SELECT id FROM authors WHERE name = 'George Orwell' LIMIT 1),
    (SELECT id FROM publishers WHERE name = 'Penguin Random House' LIMIT 1)
  UNION ALL SELECT
    'Harry Potter and the Philosopher''s Stone',
    '978-0747532699',
    '1997-06-26',
    'Fantasy',
    'Available',
    15,
    15,
    (SELECT id FROM authors WHERE name = 'J.K. Rowling' LIMIT 1),
    (SELECT id FROM publishers WHERE name = 'Bloomsbury Publishing' LIMIT 1)
  UNION ALL SELECT
    'Harry Potter and the Chamber of Secrets',
    '978-0747538493',
    '1998-07-02',
    'Fantasy',
    'Available',
    15,
    15,
    (SELECT id FROM authors WHERE name = 'J.K. Rowling' LIMIT 1),
    (SELECT id FROM publishers WHERE name = 'Bloomsbury Publishing' LIMIT 1)
  UNION ALL SELECT
    'Murder on the Orient Express',
    '978-0062693662',
    '1934-01-01',
    'Mystery',
    'Available',
    6,
    6,
    (SELECT id FROM authors WHERE name = 'Agatha Christie' LIMIT 1),
    (SELECT id FROM publishers WHERE name = 'HarperCollins' LIMIT 1)
  UNION ALL SELECT
    'And Then There Were None',
    '978-0062073488',
    '1939-11-06',
    'Mystery',
    'Available',
    6,
    6,
    (SELECT id FROM authors WHERE name = 'Agatha Christie' LIMIT 1),
    (SELECT id FROM publishers WHERE name = 'HarperCollins' LIMIT 1)
  UNION ALL SELECT
    'The Shining',
    '978-0307743657',
    '1977-01-28',
    'Horror',
    'Available',
    5,
    5,
    (SELECT id FROM authors WHERE name = 'Stephen King' LIMIT 1),
    (SELECT id FROM publishers WHERE name = 'Doubleday' LIMIT 1)
  UNION ALL SELECT
    'It',
    '978-1501142970',
    '1986-09-15',
    'Horror',
    'Available',
    5,
    5,
    (SELECT id FROM authors WHERE name = 'Stephen King' LIMIT 1),
    (SELECT id FROM publishers WHERE name = 'Simon & Schuster' LIMIT 1)
  UNION ALL SELECT
    'Pride and Prejudice',
    '978-0141439518',
    '1813-01-28',
    'Classic',
    'Available',
    8,
    8,
    (SELECT id FROM authors WHERE name = 'Jane Austen' LIMIT 1),
    (SELECT id FROM publishers WHERE name = 'Oxford University Press' LIMIT 1)
  UNION ALL SELECT
    'The Adventures of Tom Sawyer',
    '978-0486400778',
    '1876-06-01',
    'Classic',
    'Available',
    7,
    7,
    (SELECT id FROM authors WHERE name = 'Mark Twain' LIMIT 1),
    (SELECT id FROM publishers WHERE name = 'Oxford University Press' LIMIT 1)
  UNION ALL SELECT
    'To Kill a Mockingbird',
    '978-0061120084',
    '1960-07-11',
    'Classic',
    'Available',
    10,
    10,
    (SELECT id FROM authors WHERE name = 'Harper Lee' LIMIT 1),
    (SELECT id FROM publishers WHERE name = 'HarperCollins' LIMIT 1)
  UNION ALL SELECT
    'The Great Gatsby',
    '978-0743273565',
    '1925-04-10',
    'Classic',
    'Available',
    9,
    9,
    (SELECT id FROM authors WHERE name = 'F. Scott Fitzgerald' LIMIT 1),
    (SELECT id FROM publishers WHERE name = 'Simon & Schuster' LIMIT 1)
  UNION ALL SELECT
    'A Tale of Two Cities',
    '978-0486406510',
    '1859-04-30',
    'Classic',
    'Available',
    9,
    9,
    (SELECT id FROM authors WHERE name = 'Charles Dickens' LIMIT 1),
    (SELECT id FROM publishers WHERE name = 'Vintage Books' LIMIT 1)
  UNION ALL SELECT
    'The Time Machine',
    '978-0812505047',
    '1895-05-07',
    'Science Fiction',
    'Available',
    6,
    6,
    (SELECT id FROM authors WHERE name = 'H.G. Wells' LIMIT 1),
    (SELECT id FROM publishers WHERE name = 'Vintage Books' LIMIT 1)
  UNION ALL SELECT
    'Brave New World',
    '978-0060850524',
    '1932-01-01',
    'Dystopian',
    'Available',
    7,
    7,
    (SELECT id FROM authors WHERE name = 'Aldous Huxley' LIMIT 1),
    (SELECT id FROM publishers WHERE name = 'HarperCollins' LIMIT 1)
  UNION ALL SELECT
    'Twenty Thousand Leagues Under the Seas',
    '978-0553212525',
    '1870-06-20',
    'Adventure',
    'Available',
    6,
    6,
    (SELECT id FROM authors WHERE name = 'Jules Verne' LIMIT 1),
    (SELECT id FROM publishers WHERE name = 'Penguin Random House' LIMIT 1)
  UNION ALL SELECT
    'A Study in Scarlet',
    '978-1514699806',
    '1887-11-01',
    'Mystery',
    'Available',
    5,
    5,
    (SELECT id FROM authors WHERE name = 'Arthur Conan Doyle' LIMIT 1),
    (SELECT id FROM publishers WHERE name = 'Vintage Books' LIMIT 1)
  UNION ALL SELECT
    'One Hundred Years of Solitude',
    '978-0060883287',
    '1967-05-30',
    'Literary Fiction',
    'Available',
    6,
    6,
    (SELECT id FROM authors WHERE name = 'Gabriel García Márquez' LIMIT 1),
    (SELECT id FROM publishers WHERE name = 'HarperCollins' LIMIT 1)
  UNION ALL SELECT
    'War and Peace',
    '978-0199232765',
    '1869-01-01',
    'Classic',
    'Available',
    6,
    6,
    (SELECT id FROM authors WHERE name = 'Leo Tolstoy' LIMIT 1),
    (SELECT id FROM publishers WHERE name = 'Oxford University Press' LIMIT 1)
  UNION ALL SELECT
    'Crime and Punishment',
    '978-0486415871',
    '1866-01-01',
    'Classic',
    'Available',
    6,
    6,
    (SELECT id FROM authors WHERE name = 'Fyodor Dostoevsky' LIMIT 1),
    (SELECT id FROM publishers WHERE name = 'Oxford University Press' LIMIT 1)
  UNION ALL SELECT
    'Les Misérables',
    '978-0451419439',
    '1862-01-01',
    'Classic',
    'Available',
    6,
    6,
    (SELECT id FROM authors WHERE name = 'Victor Hugo' LIMIT 1),
    (SELECT id FROM publishers WHERE name = 'Penguin Random House' LIMIT 1)
) AS v
WHERE v.author_id IS NOT NULL
  AND v.publisher_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM books b WHERE b.isbn = v.isbn);

COMMIT;
