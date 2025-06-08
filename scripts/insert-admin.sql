-- Insert default admin user
INSERT INTO users (id, username, password, full_name, email, role, created_at) 
VALUES (
    'admin-id', 
    'admin', 
    'admin', 
    'Admin User', 
    'admin@example.com', 
    'admin', 
    NOW()
);
