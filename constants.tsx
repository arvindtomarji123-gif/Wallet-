
import React from 'react';
import { Category } from './types';

export const EXPENSE_CATEGORIES: Category[] = [
  { id: '1', name: 'Food', icon: '🍔', color: 'bg-orange-100 text-orange-600' },
  { id: '2', name: 'Transport', icon: '🚗', color: 'bg-blue-100 text-blue-600' },
  { id: '3', name: 'Shopping', icon: '🛍️', color: 'bg-pink-100 text-pink-600' },
  { id: '5', name: 'Entertainment', icon: '🎮', color: 'bg-purple-100 text-purple-600' },
  { id: '6', name: 'Health', icon: '🏥', color: 'bg-red-100 text-red-600' },
  { id: '7', name: 'Bills', icon: '📄', color: 'bg-yellow-100 text-yellow-600' },
  { id: '8', name: 'Education', icon: '📚', color: 'bg-indigo-100 text-indigo-600' },
  { id: '9', name: 'Other', icon: '📦', color: 'bg-slate-100 text-slate-600' },
];

export const INCOME_CATEGORIES: Category[] = [
  { id: '4', name: 'Salary', icon: '💰', color: 'bg-green-100 text-green-600' },
  { id: '10', name: 'Freelance', icon: '💻', color: 'bg-blue-100 text-blue-600' },
  { id: '11', name: 'Investments', icon: '📈', color: 'bg-emerald-100 text-emerald-600' },
  { id: '12', name: 'Gift', icon: '🎁', color: 'bg-pink-100 text-pink-600' },
  { id: '13', name: 'Other', icon: '📦', color: 'bg-slate-100 text-slate-600' },
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
