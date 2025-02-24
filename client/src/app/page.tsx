"use client";

import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { productService, Product, CreateProductDTO } from '../services/productService';

const ProductCatalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateProductDTO>({
    defaultValues: {
      name: '',
      price: 0,
      description: ''
    }
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit: SubmitHandler<CreateProductDTO> = async (data) => {
    try {
      setIsLoading(true);
      if (editingId) {
        await productService.update(editingId, {...data,price: Number(data.price)});
      } else {
        await productService.create({...data,price: Number(data.price)});
      }
      await fetchProducts();
      reset();
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (product: Product) => {
    try {
      const productData = await productService.getById(product.id);
      setEditingId(product.id);
      setValue('name', productData.name);
      setValue('price', productData.price);
      if (productData.description) {
        setValue('description', productData.description);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setIsLoading(true);
        await productService.delete(id);
        await fetchProducts();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete product');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancel = (): void => {
    reset();
    setEditingId(null);
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
          <button
            className="absolute top-0 right-0 p-2"
            onClick={() => setError(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* Form Section */}
      <div className="mb-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {editingId ? 'Edit Product' : 'Add New Product'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              {...register('name', { 
                required: 'Product name is required',
                minLength: {
                  value: 3,
                  message: 'Name must be at least 3 characters'
                },
                maxLength: {
                  value: 50,
                  message: 'Name must not exceed 50 characters'
                }
              })}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none text-gray-500 focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              step="0.1"
              {...register('price', {
                required: 'Price is required',
                min: {
                  value: 0.01,
                  message: 'Price must be greater than 0'
                },
                max:{
                  value: 1000000,
                  message: 'Price must be less than 100000'
                },
                validate: (value) => 
                  !isNaN(Number(value)) || 'Please enter a valid number'
              })}
              className={`w-full px-4 py-2 border rounded-md text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              {...register('description')}
              className={`w-full px-4 py-2 border rounded-md text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {editingId ? 'Update Product' : 'Add Product'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {product.name}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-2xl font-bold text-green-600 mb-2">
              ₹{Number(product.price).toFixed(2)}
              </p>
              {product.description && (
                <p className="text-gray-600">{product.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCatalog;