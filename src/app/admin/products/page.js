"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '../auth';
import { getAllProducts, addProduct, updateProduct, deleteProduct } from '@/lib/api';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils.js';
import ProductImageFallback from '@/components/ui/ProductImageFallback.js';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({});
  const [formError, setFormError] = useState('');
  const [uploadType, setUploadType] = useState('url'); // 'url' or 'file'
  const [previewImage, setPreviewImage] = useState('');
  const fileInputRef = useRef(null);
  
  const router = useRouter();
  const { isAdmin, loading: adminLoading } = useAdmin();

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      router.push('/admin/login');
    }
  }, [isAdmin, adminLoading, router]);

  useEffect(() => {
    async function fetchProducts() {
      if (isAdmin) {
        try {
          const data = await getAllProducts();
          setProducts(data);
        } catch (error) {
          console.error('Error fetching products:', error);
        } finally {
          setLoading(false);
        }
      }
    }

    if (isAdmin) {
      fetchProducts();
    }
  }, [isAdmin]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setFormError('');

    try {
      const newProduct = {
        name: currentProduct.name,
        description: currentProduct.description,
        price: parseFloat(currentProduct.price),
        image: currentProduct.image || '/images/products/placeholder.jpg',
        category: currentProduct.category,
        stock: parseInt(currentProduct.stock) || 0
      };

      await addProduct(newProduct);
      setIsAddingProduct(false);
      setCurrentProduct({});
      
      // Refresh products list
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      setFormError('Error adding product: ' + error.message);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    setFormError('');

    try {
      const updatedProduct = {
        id: currentProduct.id,
        name: currentProduct.name,
        description: currentProduct.description,
        price: parseFloat(currentProduct.price),
        image: currentProduct.image,
        category: currentProduct.category,
        stock: parseInt(currentProduct.stock) || 0
      };

      await updateProduct(updatedProduct);
      setIsEditingProduct(false);
      setCurrentProduct({});
      
      // Refresh products list
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      setFormError('Error updating product: ' + error.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        
        // Refresh products list
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        setFormError('Error deleting product: ' + error.message);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setCurrentProduct({...currentProduct, image: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setCurrentProduct({...currentProduct, image: url});
    setPreviewImage(url);
  };

  const toggleUploadType = () => {
    setUploadType(uploadType === 'url' ? 'file' : 'url');
    setPreviewImage('');
    if (uploadType === 'file') {
      setCurrentProduct({...currentProduct, image: ''});
    }
  };

  if (adminLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Product Management</h3>
        <button
          onClick={() => {
            setIsAddingProduct(true);
            setIsEditingProduct(false);
            setCurrentProduct({});
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Add Product
        </button>
      </div>

      {formError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 mx-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{formError}</p>
            </div>
          </div>
        </div>
      )}

      {isAddingProduct && (
        <div className="bg-gray-50 p-4 mb-4 mx-4 rounded-md">
          <h4 className="text-md font-medium text-gray-900 mb-4">Add New Product</h4>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  value={currentProduct.name || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  id="price"
                  step="0.01"
                  value={currentProduct.price || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, price: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  id="category"
                  value={currentProduct.category || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                <input
                  type="number"
                  id="stock"
                  value={currentProduct.stock || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, stock: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Product Image</label>
                  <button 
                    type="button" 
                    onClick={toggleUploadType}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Switch to {uploadType === 'url' ? 'File Upload' : 'URL Input'}
                  </button>
                </div>
                
                {uploadType === 'url' ? (
                  <input
                    type="text"
                    id="image"
                    value={currentProduct.image || ''}
                    onChange={handleImageUrlChange}
                    placeholder="Enter image URL"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                ) : (
                  <div>
                    <input
                      type="file"
                      id="image-file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="mt-1 block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-indigo-50 file:text-indigo-700
                        hover:file:bg-indigo-100"
                    />
                  </div>
                )}
                
                {previewImage && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-1">Preview:</p>
                    <div className="relative h-40 w-40 border border-gray-200 rounded-md overflow-hidden">
                      <Image 
                        src={previewImage} 
                        alt="Product preview" 
                        fill
                        className="object-cover"
                        onError={() => {
                          setPreviewImage('');
                          setFormError('Error loading image preview. Please check the URL.');
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  rows="3"
                  value={currentProduct.description || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsAddingProduct(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      )}

      {isEditingProduct && (
        <div className="bg-gray-50 p-4 mb-4 mx-4 rounded-md">
          <h4 className="text-md font-medium text-gray-900 mb-4">Edit Product</h4>
          <form onSubmit={handleEditProduct} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="edit-name"
                  value={currentProduct.name || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  id="edit-price"
                  step="0.01"
                  value={currentProduct.price || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, price: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  id="edit-category"
                  value={currentProduct.category || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-stock" className="block text-sm font-medium text-gray-700">Stock</label>
                <input
                  type="number"
                  id="edit-stock"
                  value={currentProduct.stock || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, stock: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Product Image</label>
                  <button 
                    type="button" 
                    onClick={toggleUploadType}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Switch to {uploadType === 'url' ? 'File Upload' : 'URL Input'}
                  </button>
                </div>
                
                {uploadType === 'url' ? (
                  <input
                    type="text"
                    id="edit-image"
                    value={currentProduct.image || ''}
                    onChange={handleImageUrlChange}
                    placeholder="Enter image URL"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                ) : (
                  <div>
                    <input
                      type="file"
                      id="edit-image-file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="mt-1 block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-indigo-50 file:text-indigo-700
                        hover:file:bg-indigo-100"
                    />
                  </div>
                )}
                
                {(previewImage || currentProduct.image) && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-1">Preview:</p>
                    <div className="relative h-40 w-40 border border-gray-200 rounded-md overflow-hidden">
                      <Image 
                        src={previewImage || currentProduct.image} 
                        alt="Product preview" 
                        fill
                        className="object-cover"
                        onError={() => {
                          setPreviewImage('');
                          setFormError('Error loading image preview. Please check the URL.');
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="edit-description"
                  rows="3"
                  value={currentProduct.description || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditingProduct(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Update Product
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
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
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 relative">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="object-cover rounded-md"
                          />
                        ) : (
                          <ProductImageFallback name={product.name} />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatPrice(product.price)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.stock}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setCurrentProduct(product);
                        setIsEditingProduct(true);
                        setIsAddingProduct(false);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
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
  );
}
