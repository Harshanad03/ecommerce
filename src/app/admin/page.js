"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdmin } from './auth';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [showUserForm, setShowUserForm] = useState(false);
  const [userFormData, setUserFormData] = useState({
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    role: ''
  });
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    image_url: '',
    category: '',
    stock_quantity: '',
    imageFile: null
  });
  
  const router = useRouter();
  const { isAdmin, loading: adminLoading, user, logout } = useAdmin();

  // Check admin status and fetch data
  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      router.push('/admin/login');
      return;
    }
    
    if (!adminLoading && isAdmin) {
      // Add debugging to check user role
      checkUserRole();
      checkProductsBucket();
      fetchProducts();
      fetchUsers();
    }
  }, [isAdmin, adminLoading, router]);

  // Check if products bucket exists
  const checkProductsBucket = async () => {
    try {
      console.log('Checking products bucket...');
      
      // First check if the bucket exists
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        console.error('Error listing buckets:', bucketsError);
        return;
      }
      
      console.log('Available buckets:', buckets);
      
      // Check if products bucket exists
      const productsBucket = buckets.find(bucket => bucket.name === 'products');
      
      if (!productsBucket) {
        console.log('Products bucket not found, creating...');
        
        // Create products bucket - try with simpler options
        const { data, error } = await supabase.storage.createBucket('products', {
          public: true
        });
        
        if (error) {
          console.error('Error creating products bucket:', error);
          return;
        }
        
        console.log('Products bucket created successfully');
      } else {
        console.log('Products bucket exists');
      }
      
      // Update bucket policy - try to make it public regardless of whether it was just created
      try {
        const { data, error } = await supabase.storage.updateBucket('products', {
          public: true
        });
        
        if (error) {
          console.error('Error updating bucket policy:', error);
        } else {
          console.log('Bucket policy updated successfully');
        }
      } catch (policyError) {
        console.error('Error setting bucket policy:', policyError);
      }
    } catch (err) {
      console.error('Error in checkProductsBucket:', err);
    }
  };

  // Add function to check user role
  const checkUserRole = async () => {
    try {
      if (!user) {
        console.error('No user found');
        return;
      }
      
      console.log('Current user:', user);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error('Error checking user role:', error);
        return;
      }
      
      console.log('User role in profiles table:', data);
    } catch (err) {
      console.error('Error in checkUserRole:', err);
    }
  };

  // Fetch products from database
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(`Failed to fetch products: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Add function to fetch users
  const fetchUsers = async () => {
    try {
      // Fetch regular users from user_profiles table
      const { data: userProfiles, error: userProfilesError } = await supabase
        .from('user_profiles')
        .select('*');

      if (userProfilesError) {
        console.error('Error fetching user profiles:', userProfilesError);
        throw userProfilesError;
      }

      // Fetch admin users from profiles table
      const { data: adminProfiles, error: adminProfilesError } = await supabase
        .from('profiles')
        .select('*');

      if (adminProfilesError) {
        console.error('Error fetching admin profiles:', adminProfilesError);
        throw adminProfilesError;
      }

      // Combine both datasets with role information
      const combinedUsers = userProfiles.map(profile => ({
        ...profile,
        role: 'user'
      }));

      // Add admin information from profiles table
      adminProfiles.forEach(adminProfile => {
        const existingUserIndex = combinedUsers.findIndex(user => user.id === adminProfile.id);
        if (existingUserIndex >= 0) {
          combinedUsers[existingUserIndex].role = adminProfile.role;
        } else {
          combinedUsers.push({
            id: adminProfile.id,
            email: adminProfile.email,
            role: adminProfile.role,
            first_name: 'Admin',
            last_name: 'User',
            // Fill in default values for user_profiles fields
            phone_number: 'N/A',
            address: 'N/A',
            city: 'N/A',
            state: 'N/A',
            postal_code: 'N/A',
            country: 'N/A'
          });
        }
      });

      setUsers(combinedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(`Failed to fetch users: ${error.message || 'Unknown error'}`);
    }
  };

  // Handle product form edit
  const handleEdit = (product) => {
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image_url: product.image_url,
      category: product.category,
      stock_quantity: product.stock_quantity.toString(),
      imageFile: null
    });
    setIsEditing(true);
    setShowForm(true);
    setError(null);
    setSuccess(null);
  };

  // Handle file input change
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        imageFile: e.target.files[0]
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitLoading(true);

    try {
      let finalImageUrl = formData.image_url;

      // Handle file upload if present
      if (formData.imageFile) {
        try {
          console.log('Starting image upload...');
          
          const file = formData.imageFile;
          const fileExt = file.name.split('.').pop();
          const fileName = `product-${Date.now()}.${fileExt}`;
          let filePath = fileName; // Using let instead of const since we might change it

          console.log(`Uploading file: ${fileName} (${file.type}, ${file.size} bytes)`);
          
          // Upload to Supabase Storage with simplified options
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('products')
            .upload(filePath, file);

          if (uploadError) {
            console.error('Image upload error:', uploadError);
            throw uploadError;
          }

          console.log('File uploaded successfully:', uploadData);

          // Get public URL
          const { data: urlData } = supabase.storage
            .from('products')
            .getPublicUrl(filePath);

          console.log('Image public URL data:', urlData);
          
          if (urlData && urlData.publicUrl) {
            finalImageUrl = urlData.publicUrl;
            console.log('Final image URL set to:', finalImageUrl);
          } else {
            console.error('Failed to get public URL for uploaded image');
            throw new Error('Failed to get public URL for uploaded image');
          }
        } catch (imageError) {
          console.error('Image upload error details:', imageError);
          setError(`Failed to upload image: ${imageError.message || 'Unknown error'}`);
          setSubmitLoading(false);
          return;
        }
      }

      // Prepare product data
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price) || 0,
        image_url: finalImageUrl ? finalImageUrl.trim() : '',
        category: formData.category.trim(),
        stock_quantity: parseInt(formData.stock_quantity) || 0
      };
      
      // Validate required fields
      if (!productData.name) {
        throw new Error('Product name is required');
      }
      
      if (isNaN(productData.price) || productData.price <= 0) {
        throw new Error('Product price must be a positive number');
      }
      
      if (isNaN(productData.stock_quantity) || productData.stock_quantity < 0) {
        throw new Error('Stock quantity must be a non-negative number');
      }
      
      console.log('Product data to insert:', productData);
      
      if (isEditing) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update({
            ...productData,
            updated_at: new Date().toISOString()
          })
          .eq('id', formData.id);
          
        if (error) throw error;
        
        setSuccess('Product updated successfully!');
        
        // Reset form and refresh products
        setShowForm(false);
        setFormData({
          id: '',
          name: '',
          description: '',
          price: '',
          image_url: '',
          category: '',
          stock_quantity: '',
          imageFile: null
        });
        setIsEditing(false);
        fetchProducts();
      } else {
        // Add new product
        console.log('Attempting to insert product with data:', JSON.stringify(productData, null, 2));
        
        try {
          // First, let's log the DB table structure
          const { data: tableInfo, error: tableError } = await supabase
            .from('information_schema.columns')
            .select('column_name, data_type')
            .eq('table_name', 'products')
            .eq('table_schema', 'public');
            
          if (tableError) {
            console.error('Error fetching table structure:', tableError);
          } else {
            console.log('Products table columns:', tableInfo);
          }
          
          // Now try to insert with only basic fields
          const basicProductData = {
            name: productData.name,
            description: productData.description,
            price: productData.price,
            image_url: productData.image_url,
            category: productData.category,
            stock_quantity: productData.stock_quantity
          };
          
          console.log('Inserting with simplified data:', basicProductData);
          
          const { data, error } = await supabase
            .from('products')
            .insert([basicProductData])
            .select();
          
          if (error) {
            console.error('Product insertion error:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            console.error('Error details:', error.details);
            throw error;
          }
          
          console.log('Successfully inserted product:', data);
          setSuccess('Product added successfully!');
          
          // Reset form and refresh products
          setShowForm(false);
          setFormData({
            id: '',
            name: '',
            description: '',
            price: '',
            image_url: '',
            category: '',
            stock_quantity: '',
            imageFile: null
          });
          fetchProducts();
        } catch (insertError) {
          console.error('Error inserting product:', insertError);
          setError(`Failed to save product: ${insertError.message || 'Unknown error'}`);
          setSubmitLoading(false);
        }
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setError(`Failed to save product: ${error.message || 'Unknown error'}`);
      setSubmitLoading(false);
    } finally {
      // Make sure loading state is always reset
      setSubmitLoading(false);
    }
  };

  // Delete a product
  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      
      setSuccess('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      setError(`Failed to delete product: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Add function to handle user edit
  const handleUserEdit = (user) => {
    setUserFormData({
      id: user.id,
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone_number: user.phone_number || '',
      address: user.address || '',
      city: user.city || '',
      state: user.state || '',
      postal_code: user.postal_code || '',
      country: user.country || '',
      role: user.role || 'user'
    });
    setShowUserForm(true);
  };

  // Add function to handle user form submission
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitLoading(true);

    try {
      // Update user profile data
      const updateData = {
        first_name: userFormData.first_name,
        last_name: userFormData.last_name,
        phone_number: userFormData.phone_number,
        address: userFormData.address,
        city: userFormData.city,
        state: userFormData.state,
        postal_code: userFormData.postal_code,
        country: userFormData.country
      };

      // Update user profile in user_profiles table
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', userFormData.id);

      if (profileError) {
        console.error('Error updating user profile:', profileError);
        throw profileError;
      }

      // Update user role in profiles table if admin
      if (userFormData.role === 'admin') {
        const { error: roleError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', userFormData.id);

        if (roleError) {
          console.error('Error updating user role:', roleError);
          throw roleError;
        }
      } else {
        // Update user role to 'user' in profiles table
        const { error: roleError } = await supabase
          .from('profiles')
          .update({ role: 'user' })
          .eq('id', userFormData.id);

        if (roleError) {
          console.error('Error updating user role:', roleError);
          throw roleError;
        }
      }

      setSuccess('User updated successfully!');
      setShowUserForm(false);
      
      // Refresh users list
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      setError(`Failed to update user: ${error.message || 'Unknown error'}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-indigo-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notifications */}
        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Admin Dashboard Overview */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
            
            {/* Add user info and logout button */}
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-4">
                {user?.email || 'Admin'}
              </span>
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Logout
              </button>
            </div>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                  </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{products.length}</h3>
                  <p className="text-sm text-gray-600">Total Products</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                  </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">0</h3>
                  <p className="text-sm text-gray-600">Total Orders</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                  </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{users.length}</h3>
                  <p className="text-sm text-gray-600">Total Users</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="mb-6">
          <ul className="flex border-b">
            <li className="mr-1">
              <button
                onClick={() => setActiveTab('products')}
                className={`py-2 px-4 text-sm font-medium ${
                  activeTab === 'products'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Products
              </button>
            </li>
            <li className="mr-1">
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-2 px-4 text-sm font-medium ${
                  activeTab === 'orders'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Orders
              </button>
            </li>
            <li className="mr-1">
              <button
                onClick={() => setActiveTab('users')}
                className={`py-2 px-4 text-sm font-medium ${
                  activeTab === 'users'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Users
              </button>
            </li>
          </ul>
        </nav>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Product Management</h3>
              <button
                onClick={() => {
                  setShowForm(true);
                  setIsEditing(false);
                  setFormData({
                    id: '',
                    name: '',
                    description: '',
                    price: '',
                    image_url: '',
                    category: '',
                    stock_quantity: '',
                    imageFile: null
                  });
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Add New Product
              </button>
            </div>

            {/* Product Form */}
            {showForm && (
              <div className="bg-white p-6 rounded shadow-md mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {isEditing ? 'Edit Product' : 'Add New Product'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Product Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                      />
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <select
                        id="category"
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                      >
                        <option value="">Select a category</option>
                        <option value="electronics">Electronics</option>
                        <option value="clothing">Clothing</option>
                        <option value="books">Books</option>
                        <option value="home">Home & Kitchen</option>
                        <option value="toys">Toys & Games</option>
                        <option value="beauty">Beauty & Personal Care</option>
                        <option value="sports">Sports & Outdoors</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        id="price"
                        required
                        min="0.01"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                      />
                    </div>

                    <div>
                      <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        id="stock"
                        required
                        min="0"
                        step="1"
                        value={formData.stock_quantity}
                        onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      required
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                    ></textarea>
                  </div>

                  <div>
                    <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
                      Image URL
                    </label>
                    <input
                      type="text"
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                      placeholder="https://example.com/image.jpg"
                    />
            </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Or Upload Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="mt-1 block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitLoading}
                      className={`bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 ${
                        submitLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {submitLoading ? 'Saving...' : isEditing ? 'Update Product' : 'Add Product'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Products List */}
            <div className="bg-white shadow-md rounded">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-indigo-600 rounded-full mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-600">No products found. Add some products to get started!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 relative">
                                {product.image_url && product.image_url.trim() ? (
                                  <Image
                                    src={product.image_url}
                                    alt={product.name}
                                    fill
                                    sizes="40px"
                                    style={{ objectFit: 'cover' }}
                                    className="rounded-md"
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{product.category}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.stock_quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              product.stock_quantity > 0 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders Tab - Placeholder */}
        {activeTab === 'orders' && (
          <div className="bg-white p-6 rounded shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Order Management</h3>
              </div>
            <div className="text-center p-10">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
              <p className="mt-1 text-sm text-gray-500">Order management will be implemented in a future update.</p>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white p-6 rounded shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">User Management</h3>
            </div>
            
            {/* User Edit Form Modal */}
            {showUserForm && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                <div className="relative top-20 mx-auto p-5 border w-full max-w-xl shadow-lg rounded-md bg-white">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Edit User</h3>
                    <button 
                      onClick={() => setShowUserForm(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <form onSubmit={handleUserSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="first_name"
                          required
                          value={userFormData.first_name}
                          onChange={(e) => setUserFormData({ ...userFormData, first_name: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="last_name"
                          required
                          value={userFormData.last_name}
                          onChange={(e) => setUserFormData({ ...userFormData, last_name: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          disabled
                          value={userFormData.email}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 text-gray-900"
                        />
                        <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                      </div>
                      
                      <div>
                        <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone_number"
                          value={userFormData.phone_number}
                          onChange={(e) => setUserFormData({ ...userFormData, phone_number: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                          Address
                        </label>
                        <input
                          type="text"
                          id="address"
                          value={userFormData.address}
                          onChange={(e) => setUserFormData({ ...userFormData, address: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          value={userFormData.city}
                          onChange={(e) => setUserFormData({ ...userFormData, city: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                          State/Province
                        </label>
                        <input
                          type="text"
                          id="state"
                          value={userFormData.state}
                          onChange={(e) => setUserFormData({ ...userFormData, state: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          id="postal_code"
                          value={userFormData.postal_code}
                          onChange={(e) => setUserFormData({ ...userFormData, postal_code: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                          Country
                        </label>
                        <input
                          type="text"
                          id="country"
                          value={userFormData.country}
                          onChange={(e) => setUserFormData({ ...userFormData, country: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                          Role
                        </label>
                        <select
                          id="role"
                          value={userFormData.role}
                          onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setShowUserForm(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitLoading}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        {submitLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
        </div>
      </div>
            )}
            
            {users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role === 'admin' ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleUserEdit(user)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-10">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                <p className="mt-1 text-sm text-gray-500">We couldn't find any users in the system.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
