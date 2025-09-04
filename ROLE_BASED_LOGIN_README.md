# Role-Based Login System for Bike Dealership

This document outlines the implementation of a comprehensive role-based authentication system for the bike dealership application.

## 🚀 Features Implemented

### 1. **Enhanced Authentication Context**
- **Role Management**: Stores and manages user roles from JWT tokens
- **User Information**: Extracts and stores additional user data from tokens
- **Role Utilities**: Helper functions for role checking (`isAdmin()`, `isCustomer()`, `hasRole()`)
- **Loading States**: Proper loading management during authentication checks

### 2. **Improved Login Component**
- **Role Extraction**: Automatically extracts user role from JWT token
- **Role-Based Navigation**: Routes users to appropriate pages based on their role
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Visual feedback during login process
- **Form Validation**: Enhanced form with better UX

### 3. **Protected Route System**
- **Role-Based Access Control**: Restricts access based on user roles
- **Smart Redirects**: Redirects unauthorized users to appropriate pages
- **Loading Management**: Shows loading states while checking authentication
- **Flexible Configuration**: Configurable redirect paths and role requirements

### 4. **Role-Based Navigation**
- **Dynamic Menu Items**: Shows different navigation based on user role
- **Admin Features**: Admin-specific navigation (Admin Panel, Add Bike)
- **Customer Features**: Customer-specific navigation (Book Bike, My Bookings)
- **User Information**: Displays user role and username in navigation

### 5. **Role Dashboard**
- **Role-Specific Content**: Different dashboard views for Admin and Customer
- **Quick Actions**: Easy access to role-specific features
- **Visual Design**: Beautiful card-based layout with role-specific styling

## 🔐 Role System

### **Admin Role**
- Access to Admin Panel
- Add/Edit/Delete bikes
- Manage system settings
- Full access to all features

### **Customer Role**
- Browse bikes
- Book bikes
- View booking history
- Limited access to admin features

**Note**: Only Customer and Admin roles are supported. Any other roles will be rejected during login.

## 🛠️ Technical Implementation

### **Authentication Flow**
1. User submits login credentials
2. Backend validates and returns JWT token
3. Frontend extracts role from token payload
4. User is redirected based on role
5. Navigation and access control updated accordingly

### **JWT Token Structure**
```json
{
  "username": "user123",
  "role": "Admin",
  "email": "user@example.com",
  "userId": "12345",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### **Role Checking Methods**
```javascript
// Check specific role
const { hasRole } = useAuth();
if (hasRole('admin')) { /* admin logic */ }

// Check multiple roles
const { hasAnyRole } = useAuth();
if (hasAnyRole(['admin', 'moderator'])) { /* logic */ }

// Quick role checks
const { isAdmin, isCustomer } = useAuth();
if (isAdmin()) { /* admin logic */ }
```

## 📁 File Structure

```
src/
├── context/
│   └── AuthContext.jsx          # Enhanced authentication context
├── component/
│   ├── Login.jsx                # Enhanced login with role handling
│   ├── ProtectedRoute.jsx       # Role-based route protection
│   ├── Navbarr.jsx              # Role-based navigation
│   └── RoleDashboard.jsx        # Role-specific dashboard
├── hooks/
│   └── useAuth.js               # Custom authentication hooks
└── all.css                      # Enhanced styling for role-based UI
```

## 🎨 UI Enhancements

### **Login Form**
- Modern, responsive design
- Loading states and error handling
- Role-based success feedback

### **Navigation**
- Role badges showing user role
- Dynamic menu items based on role
- User information display

### **Dashboard**
- Role-specific card layouts
- Color-coded by role (Admin: Red, Customer: Gold)
- Hover effects and animations

## 🔒 Security Features

### **Route Protection**
- All sensitive routes are protected
- Role-based access control
- Automatic redirects for unauthorized access

### **Token Management**
- Secure token storage in localStorage
- Automatic token validation
- Proper logout and cleanup

### **Error Handling**
- Comprehensive error messages
- Secure error logging
- User-friendly error display

## 🚀 Usage Examples

### **Protecting Routes**
```jsx
<Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={["Admin"]}>
      <Admin />
    </ProtectedRoute>
  }
/>
```

### **Using Role Hooks**
```jsx
import { useAdminAccess, useCustomerAccess } from '../hooks/useAuth';

const MyComponent = () => {
  const { isAdmin } = useAdminAccess();
  const { isCustomer } = useCustomerAccess();
  
  return (
    <div>
      {isAdmin && <AdminPanel />}
      {isCustomer && <CustomerFeatures />}
    </div>
  );
};
```

### **Role-Based Rendering**
```jsx
const { isAdmin, isCustomer } = useAuth();

return (
  <div>
    {isAdmin() && <AdminControls />}
    {isCustomer() && <CustomerActions />}
  </div>
);
```

## 🔧 Configuration

### **Backend Requirements**
- JWT tokens must include `role` field
- Role values must be exactly: `"Admin"` or `"Customer"`
- Any other role values will be rejected
- Token should contain user information

### **Frontend Configuration**
- Only Customer and Admin roles are supported
- Update role names in `AuthContext.jsx` if backend uses different values
- Modify allowed roles in route protection as needed (only Customer and Admin)
- Customize role-based navigation in `Navbarr.jsx`

## 🧪 Testing

### **Test Cases**
1. **Admin Login**: Should redirect to `/admin`
2. **Customer Login**: Should redirect to `/product`
3. **Unauthorized Access**: Should redirect to appropriate page
4. **Role-Based Navigation**: Should show correct menu items
5. **Protected Routes**: Should block unauthorized access

### **Manual Testing**
1. Login with admin credentials
2. Verify admin navigation appears
3. Access admin-only routes
4. Test customer role functionality
5. Verify logout clears all data

## 🚀 Future Enhancements

### **Planned Features**
- **Role Hierarchy**: Support for role inheritance
- **Permission System**: Granular permission control
- **Session Management**: Better session handling
- **Multi-Factor Authentication**: Enhanced security
- **Audit Logging**: Track user actions

### **Scalability**
- **Role Groups**: Group-based permissions
- **Dynamic Roles**: Runtime role assignment
- **API Integration**: Backend role validation
- **Caching**: Optimize role checks

## 📝 Notes

- Ensure backend JWT tokens include the `role` field
- Role names are case-sensitive in the current implementation
- All role checks use lowercase comparison for flexibility
- Loading states prevent authentication race conditions
- Error handling provides user-friendly feedback

## 🤝 Contributing

When adding new features:
1. Follow the existing role-based patterns
2. Use the provided authentication hooks
3. Test with different user roles
4. Update documentation as needed
5. Ensure proper error handling

---

**Built with ❤️ for the Bike Dealership Application**
