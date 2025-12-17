/*
  # Create Business Website Tables

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text) - Product name
      - `description` (text) - Product description
      - `price` (numeric) - Product price
      - `image_url` (text) - Product image URL
      - `created_at` (timestamptz) - Creation timestamp
      - `display_order` (integer) - Order for displaying products
    
    - `enquiries`
      - `id` (uuid, primary key)
      - `product_id` (uuid) - Reference to product
      - `product_name` (text) - Product name (denormalized for safety)
      - `customer_name` (text) - Customer name
      - `customer_email` (text) - Customer email
      - `customer_phone` (text) - Customer phone
      - `message` (text) - Enquiry message
      - `created_at` (timestamptz) - Creation timestamp
      - `status` (text) - Enquiry status (new, contacted, closed)

  2. Security
    - Enable RLS on both tables
    - Products: Public read access (anyone can view products)
    - Enquiries: Public insert access (anyone can submit enquiries)
    - Enquiries: No public read access (only admin can view)

  3. Sample Data
    - Insert sample products for demonstration
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price numeric(10, 2) NOT NULL,
  image_url text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create enquiries table
CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id),
  product_name text NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  message text DEFAULT '',
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Products policies: Anyone can view products
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO anon
  USING (true);

-- Enquiries policies: Anyone can insert enquiries
CREATE POLICY "Anyone can submit enquiries"
  ON enquiries FOR INSERT
  TO anon
  WITH CHECK (true);

-- Insert sample products
INSERT INTO products (name, description, price, image_url, display_order) VALUES
  ('Web Development', 'Professional website development services with modern technologies', 999.00, 'https://images.pexels.com/photos/326503/pexels-photo-326503.jpeg?auto=compress&cs=tinysrgb&w=800', 1),
  ('Mobile App Development', 'Native and cross-platform mobile application development', 1499.00, 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=800', 2),
  ('Digital Marketing', 'Comprehensive digital marketing strategies to grow your business', 799.00, 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800', 3),
  ('SEO Optimization', 'Search engine optimization to improve your online visibility', 599.00, 'https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg?auto=compress&cs=tinysrgb&w=800', 4),
  ('Cloud Solutions', 'Scalable cloud infrastructure and deployment services', 1299.00, 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800', 5),
  ('UI/UX Design', 'Beautiful and intuitive user interface and experience design', 899.00, 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800', 6)
ON CONFLICT DO NOTHING;