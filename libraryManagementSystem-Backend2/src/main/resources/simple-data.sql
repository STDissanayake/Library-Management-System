-- Simple test data without complex relationships
INSERT INTO authors (name, bio, nationality) VALUES
('J.K. Rowling', 'British author best known for Harry Potter series', 'British'),
('George Orwell', 'English novelist and essayist', 'British'),
('Harper Lee', 'American novelist', 'American');

INSERT INTO publishers (name, address, contact_info) VALUES
('Bloomsbury Publishing', 'London, UK', 'contact@bloomsbury.com'),
('Penguin Random House', 'New York, USA', 'info@penguinrandomhouse.com'),
('HarperCollins', 'New York, USA', 'contact@harpercollins.com');

INSERT INTO books (title, isbn, publication_date, category, status) VALUES
('Harry Potter and the Sorcerer''s Stone', '978-0-439-70818-8', '1997-06-26', 'Fantasy', 'Available'),
('1984', '978-0-452-28423-4', '1949-06-08', 'Dystopian', 'Available'),
('To Kill a Mockingbird', '978-0-06-112008-4', '1960-07-11', 'Fiction', 'Available');

INSERT INTO members (first_name, last_name, email, phone, address, status, registration_date) VALUES
('Alice', 'Williams', 'alice@email.com', '555-0101', '123 Main St', 'ACTIVE', CURRENT_TIMESTAMP),
('Bob', 'Johnson', 'bob@email.com', '555-0102', '456 Oak Ave', 'ACTIVE', CURRENT_TIMESTAMP),
('Charlie', 'Brown', 'charlie@email.com', '555-0103', '789 Pine Rd', 'ACTIVE', CURRENT_TIMESTAMP);
