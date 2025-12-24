# 🕵️ Proje Tespit Raporu

**Analiz Yolu:** `D:\servesel-toptan`
**Tarih:** 2025-12-24 23:22:41

## 1. Proje Özeti
- **Proje Türü:** Next.js Projesi
- **Dosya Sayısı:** 121
- **Toplam Satır:** 13480
- **Tespit Edilen Teknolojiler:** react, next, prisma, supabase
- **Kullanılan Diller/Uzantılar:** .md, .txt, .json, .js, .groovy, .html, .py, .mjs, .ts, .css, .prisma, .tsbuildinfo, .svg, .tsx

## 2. Klasör ve Dosya Yapısı
```text
    📄 analiz.py (321 satır)
    📄 create-admin.ts (42 satır)
    📄 eslint.config.mjs (18 satır)
    📄 generator client {.groovy (80 satır)
    📄 git pull origin main --rebase.md (1 satır)
    📄 git push origin main.txt (1 satır)
    📄 middleware.ts (23 satır)
    📄 next-env.d.ts (7 satır)
    📄 next.config.js (10 satır)
    📄 package.json (23 satır)
    📄 postcss.config.mjs (9 satır)
    📄 README.md (36 satır)
    📄 site-analiz.js (63 satır)
    📄 tailwind.config.ts (14 satır)
    📄 tsconfig.json (43 satır)
    📄 tsconfig.tsbuildinfo (1 satır)
    📄 vercel.json (45 satır)
    📁 app/
        📄 globals.css (14 satır)
        📄 layout.tsx (43 satır)
        📄 page.tsx (82 satır)
        📁 admin/
            📄 layout.tsx (61 satır)
            📄 page.tsx (141 satır)
            📁 products/
                📄 page.tsx (138 satır)
        📁 api/
            📁 admin/
                📄 page.tsx (188 satır)
                📁 products/
                    📄 page.tsx (143 satır)
            📁 admin-yap/
                📄 route.ts (24 satır)
            📁 auth/
                📁 [...nextauth]/
                    📄 route.ts (54 satır)
            📁 orders/
                📄 route.ts (42 satır)
            📁 products/
                📄 route.ts (105 satır)
            📁 register/
                📄 route.ts (66 satır)
            📁 setup/
                📄 route.ts (55 satır)
            📁 siparis-olustur/
                📄 route.ts (87 satır)
        📁 cart/
            📄 page.tsx (162 satır)
        📁 contact/
            📄 page.tsx (175 satır)
        📁 dashboard/
            📄 page.tsx (30 satır)
        📁 login/
            📄 page.tsx (70 satır)
        📁 menu/
            📄 page.tsx (31 satır)
        📁 register/
            📄 page.tsx (48 satır)
    📁 components/
        📄 CartButton.tsx (40 satır)
        📄 CartProvider.tsx (90 satır)
        📄 DashboardClient.tsx (166 satır)
        📄 Footer.tsx (23 satır)
        📄 Header.tsx (50 satır)
        📄 ProductCard.tsx (64 satır)
    📁 generated/
        📄 browser.ts (44 satır)
        📄 client.ts (66 satır)
        📄 commonInputTypes.ts (333 satır)
        📄 enums.ts (29 satır)
        📄 models.ts (16 satır)
        📁 internal/
            📄 class.ts (230 satır)
            📄 prismaNamespace.ts (1142 satır)
            📄 prismaNamespaceBrowser.ts (155 satır)
        📁 models/
            📄 Category.ts (1297 satır)
            📄 Order.ts (1569 satır)
            📄 OrderItem.ts (1521 satır)
            📄 Product.ts (1897 satır)
            📄 User.ts (1673 satır)
    📁 lib/
        📄 auth.ts (40 satır)
        📄 prisma.ts (11 satır)
        📄 supabaseClient.ts (7 satır)
        📄 validations.ts (10 satır)
    📁 out/
        📄 404.html (1 satır)
        📄 file.svg (1 satır)
        📄 globe.svg (1 satır)
        📄 index.html (1 satır)
        📄 index.txt (13 satır)
        📄 next.svg (1 satır)
        📄 vercel.svg (1 satır)
        📄 window.svg (1 satır)
        📄 __next._full.txt (13 satır)
        📄 __next._head.txt (7 satır)
        📄 __next._index.txt (4 satır)
        📄 __next._tree.txt (1 satır)
        📄 __next.__PAGE__.txt (6 satır)
        📁 404/
            📄 index.html (1 satır)
        📁 dashboard/
            📄 index.html (1 satır)
            📄 index.txt (16 satır)
            📄 __next.dashboard.txt (4 satır)
            📄 __next._full.txt (16 satır)
            📄 __next._head.txt (7 satır)
            📄 __next._index.txt (4 satır)
            📄 __next._tree.txt (1 satır)
            📁 __next.dashboard/
                📄 __PAGE__.txt (9 satır)
        📁 _next/
            📁 gyWqCOFtWqpELp0C5jF72/
            📁 static/
                📁 chunks/
                    📄 04b0dab5e5101fec.js (5 satır)
                    📄 12402b52d02563bf.js (5 satır)
                    📄 19d86731842579e9.js (4 satır)
                    📄 2139e000f4b5d584.js (1 satır)
                    📄 247eb132b7f7b574.js (1 satır)
                    📄 3dcc93bb4829c1ba.js (1 satır)
                    📄 43827a1947d79379.js (37 satır)
                    📄 59a50e1e90532f49.js (1 satır)
                    📄 5b819784709d4b96.js (1 satır)
                    📄 796e69ae18b2784c.js (1 satır)
                    📄 9c23f44fff36548a.js (1 satır)
                    📄 a6dad97d9634a72d.js (1 satır)
                    📄 d1574d369488d1cf.js (2 satır)
                    📄 da9fed53ecc65ef3.js (5 satır)
                    📄 fd7c0943d5cd5e09.js (1 satır)
                    📄 ff1a16fafef87110.js (1 satır)
                    📄 turbopack-66754e262bc926ae.js (3 satır)
                    📄 turbopack-a20af44eeee5468f.js (3 satır)
                    📄 turbopack-ba2b0cc1891ff4f4.js (3 satır)
                📁 gyWqCOFtWqpELp0C5jF72/
                    📄 _buildManifest.js (15 satır)
                    📄 _clientMiddlewareManifest.json (1 satır)
                    📄 _ssgManifest.js (1 satır)
        📁 _not-found/
            📄 index.html (1 satır)
            📄 index.txt (12 satır)
            📄 __next._full.txt (12 satır)
            📄 __next._head.txt (7 satır)
            📄 __next._index.txt (4 satır)
            📄 __next._not-found.txt (4 satır)
            📄 __next._tree.txt (1 satır)
            📁 __next._not-found/
                📄 __PAGE__.txt (5 satır)
    📁 pages/
        📁 api/
    📁 prisma/
        📄 schema.prisma (72 satır)
        📄 seed.ts (166 satır)
    📁 public/
        📄 file.svg (1 satır)
        📄 globe.svg (1 satır)
        📄 next.svg (1 satır)
        📄 vercel.svg (1 satır)
        📄 window.svg (1 satır)
    📁 types/
        📄 next-auth.d.ts (18 satır)
```

## 3. Dosya Detayları (Örnek İçerikler)
### `analiz.py`
```
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
```
### `create-admin.ts`
```
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
```
### `eslint.config.mjs`
```
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
```
### `generator client {.groovy`
```
public      Boolean  @default(true)
```
### `middleware.ts`
```
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
function middleware(req) {
```
### `next-env.d.ts`
```
import "./.next/dev/types/routes.d.ts";
```
### `next.config.js`
```
const nextConfig = {
```
### `postcss.config.mjs`
```
const config = {
```
### `README.md`
```
## Getting Started
# or
# or
```
### `site-analiz.js`
```
const fs = require('fs');
const path = require('path');
const appDir = path.join(process.cwd(), 'app');
```
### `tailwind.config.ts`
```
import type { Config } from "tailwindcss";
const config: Config = {
```
### `layout.tsx`
```
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
```
### `page.tsx`
```
import Link from "next/link";
import Image from "next/image";
className="bg-blue-600 hover:bg-blue-700 text-white font-bol...
```
### `layout.tsx`
```
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
```
### `page.tsx`
```
import Link from "next/link";
const stats = {
```
### `page.tsx`
```
import Link from "next/link";
import { useState } from "react";
const initialProducts = [
```
### `page.tsx`
```
import { useState, useEffect } from "react";
import { Package, Edit, Trash2, Plus, X, CheckCircle, XCircl...
const [products, setProducts] = useState<any[]>([]);
```
### `page.tsx`
```
import { useState, useEffect } from "react";
import { Package, Edit, Trash2, Plus, X, CheckCircle, XCircl...
const [products, setProducts] = useState<any[]>([]);
```
### `route.ts`
```
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, prisma } from "@/lib/auth";
```
### `route.ts`
```
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credent...
import { PrismaClient } from "@prisma/client";
```
### `route.ts`
```
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, prisma } from "@/lib/auth";
```
### `route.ts`
```
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, prisma } from "@/lib/auth";
```
### `route.ts`
```
import { NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
import bcrypt from "bcryptjs";
```
### `route.ts`
```
import { NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
let category = await prisma.category.findFirst({ where: { sl...
```
### `route.ts`
```
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
```
### `page.tsx`
```
import { useCart } from "@/components/CartProvider";
import Image from "next/image";
import Link from "next/link";
```
### `page.tsx`
```
import { useState } from "react";
import { ExternalLink, Send, MessageCircle } from "lucide-re...
const [formData, setFormData] = useState({
```
### `page.tsx`
```
import { getServerSession } from "next-auth";
import { authOptions, prisma } from "@/lib/auth";
import { redirect } from "next/navigation";
```
### `page.tsx`
```
import { useState, Suspense } from "react"; // Suspense ekle...
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation"...
```
### `page.tsx`
```
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
const initialProducts = [
```
### `page.tsx`
```
import { useState } from "react";
import { useRouter } from "next/navigation";
const router = useRouter();
```
### `CartButton.tsx`
```
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
const { cartCount } = useCart();
```
### `CartProvider.tsx`
```
import React, { createContext, useContext, useState, ReactNo...
const CartContext = createContext<CartContextType | undefine...
const [cartItems, setCartItems] = useState<CartItem[]>([]);
```
### `DashboardClient.tsx`
```
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, LogOut, Package, CheckCircle, Send } ...
```
### `Footer.tsx`
```
import { Package, Phone } from "lucide-react";
import Link from "next/link";
```
### `Header.tsx`
```
import Link from 'next/link';
import { useCart } from "@/components/CartProvider"; // Cart...
const { cartCount } = useCart(); // Sepetteki güncel ürün sa...
```
### `ProductCard.tsx`
```
import Image from "next/image";
import { useCart, CartItem } from "@/components/CartProvider...
const { addToCart } = useCart(); // CartProvider'dan ekleme ...
```
### `browser.ts`
```
import * as Prisma from './internal/prismaNamespaceBrowser'
```
### `client.ts`
```
import * as process from 'node:process'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
```
### `commonInputTypes.ts`
```
import type * as runtime from "@prisma/client/runtime/client...
import * as $Enums from "./enums"
import type * as Prisma from "./internal/prismaNamespace"
```
### `class.ts`
```
import * as runtime from "@prisma/client/runtime/client"
import type * as Prisma from "./prismaNamespace"
const config: runtime.GetPrismaClientConfig = {
```
### `prismaNamespace.ts`
```
import * as runtime from "@prisma/client/runtime/client"
import type * as Prisma from "../models"
import { type PrismaClient } from "./class"
```
### `prismaNamespaceBrowser.ts`
```
import * as runtime from "@prisma/client/runtime/index-brows...
public: 'public'
default: 'default',
```
### `Category.ts`
```
import type * as runtime from "@prisma/client/runtime/client...
import type * as $Enums from "../enums"
import type * as Prisma from "../internal/prismaNamespace"
```
### `Order.ts`
```
import type * as runtime from "@prisma/client/runtime/client...
import type * as $Enums from "../enums"
import type * as Prisma from "../internal/prismaNamespace"
```
### `OrderItem.ts`
```
import type * as runtime from "@prisma/client/runtime/client...
import type * as $Enums from "../enums"
import type * as Prisma from "../internal/prismaNamespace"
```
### `Product.ts`
```
import type * as runtime from "@prisma/client/runtime/client...
import type * as $Enums from "../enums"
import type * as Prisma from "../internal/prismaNamespace"
```
### `User.ts`
```
import type * as runtime from "@prisma/client/runtime/client...
import type * as $Enums from "../enums"
import type * as Prisma from "../internal/prismaNamespace"
```
### `auth.ts`
```
import { PrismaClient } from "@prisma/client";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credent...
```
### `prisma.ts`
```
import { PrismaClient } from "@prisma/client";
const globalForPrisma = global as unknown as { prisma: Prism...
```
### `supabaseClient.ts`
```
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANO...
```
### `validations.ts`
```
import { z } from "zod";
```
### `43827a1947d79379.js`
```
import ws from "ws"
const client = new RealtimeClient(url, {
```
### `turbopack-66754e262bc926ae.js`
```
importScripts(...self.TURBOPACK_NEXT_CHUNK_URLS.map(c => sel...
```
### `turbopack-a20af44eeee5468f.js`
```
importScripts(...self.TURBOPACK_NEXT_CHUNK_URLS.map(c => sel...
```
### `turbopack-ba2b0cc1891ff4f4.js`
```
importScripts(...self.TURBOPACK_NEXT_CHUNK_URLS.map(c => sel...
```
### `schema.prisma`
```
public      Boolean  @default(true)
```
### `seed.ts`
```
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
```
### `next-auth.d.ts`
```
import NextAuth from "next-auth";
```
