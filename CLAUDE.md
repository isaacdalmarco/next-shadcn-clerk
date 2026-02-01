# 🚀 Cursor Rules - Clean Code & Best Practices

# Save this rules file in the root of the project (CLAUDE.md)

## 📋 Main Guidelines (MANDATORY)

### 1. **General Rules**

- ✅ For new server-side routes, always prefer using server actions instead of routes.
- ✅ Whenever creating an entity, always consider organizationId as a foreign key.
- ✅ Always filter data by organizationId in server-side Prisma queries.
- ✅ Whenever you need to use authenticated user data, use the useUser hook from Clerk.
- ✅ Whenever you need to use authenticated organization data, use the useOrganization hook from Clerk.
- ✅ ALWAYS create fixed texts using the useTranslations hook and in the 3 supported languages (en, es, pt-BR)
- ✅ When creating the i18n structure, pay attention to using specific keys for specific screens instead of generic names.
- ✅ Always use dialog for record deletion confirmation.
- ✅ Always use zod for data validation in forms.

### 2. **Technology Stack**

- ✅ ALWAYS use pnpm as package manager
- ✅ ALWAYS use the project stack which is NextJs with TypeScript
- ✅ ALWAYS use Clerk for authentication
- ✅ ALWAYS use Shadcn for components - avoid using card for forms inside dialog to prevent redundant styling
- ✅ ALWAYS use Tanstack Query to manage state coming from server-side
- ✅ ALWAYS use Zustand to manage state on client-side
- ✅ ALWAYS use Tailwind CSS for styles
- ✅ ALWAYS use Prisma for ORM

### 3. **Single Responsibility Principle (SRP)**

- ✅ Each class/function should have ONE single responsibility
- ❌ NEVER create classes/functions that do multiple things
- 🔍 If a function/class has more than one responsibility, refactor by dividing into multiple ones

### 4. **File Size**

- ✅ Files should NOT exceed 300 lines
- ❌ If a file exceeds 300 lines, divide into multiple files
- 📁 Use folders to organize related functionalities

### 5. **Function Size**

- ✅ Functions should NOT exceed 30 lines
- ✅ Functions should NOT have more than 4 parameters
- ❌ If a function is too long, divide into smaller functions
- 🔧 Use objects to group related parameters

### 6. **Dependency Injection**

- ✅ ALWAYS use dependency injection
- ❌ NEVER instantiate dependencies directly inside classes
- 🎯 Pass dependencies via constructor or parameters

### 7. **Code Comments and Documentation**

- ✅ ALWAYS add short and direct description of the responsibility of each function, class and component

---

### 8. **Architecture and Code Structure Guidelines**

- ✅ ALWAYS consider the current organization to filter screen information and to create new entities

### **File Organization for NextJs Project**

```
src/
├── components/         # Reusable React components
├── hooks/              # Custom hooks
├── services/           # Business logic
├── utils/              # Utility functions
├── types/              # Type definitions
├── constants/          # Application constants
├── app/dashboard/      # Pages
├── app/api/            # NextJs routes
└── features/           # Application features
```

---

## 📝 Review Checklist

Before submitting code, verify:

- [ ] Does the file have less than 300 lines?
- [ ] Do functions have less than 30 lines?
- [ ] Do functions have less than 4 parameters?
- [ ] Does each class/function have a single responsibility?
- [ ] Are dependencies injected (not instantiated)?
- [ ] Are names descriptive and meaningful?
- [ ] Are there no unnecessary side effects?
- [ ] Is the code well organized and readable?
