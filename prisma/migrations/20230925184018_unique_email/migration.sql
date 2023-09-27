/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");


/* query to insert users
INSERT INTO users (role_id, email, password, verification_token, forgot_password_token, username)
VALUES
  (1, 'demo@gmail.com', '$2a$12$TdnrQwHn64D0Wg3amFyrDuLyqLJjCjhhCEQthBpQHFvpDDnx5TQ6.', 'abcdefghijklmnopqrstuvwxyz1234567890', 'abcdefghijklmnopqrstuvwxyz1234567890', 'demo@gmail.com'),
  (2, 'client@barqsol.com', '$2a$12$0JN54Fuul8C.sI9w0/VXWed4WmOOgsFycOYX7mUuTPcn7f9EqwYHW', 'abcdefghijklmnopqrstuvwxyz1234567890', 'abcdefghijklmnopqrstuvwxyz1234567890', 'client@barqsol.com');

*/