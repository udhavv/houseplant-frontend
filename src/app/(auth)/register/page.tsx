// // app/(auth)/register/page.tsx
// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import { motion, AnimatePresence } from 'framer-motion'
// import { GuestGuard } from '@/components/auth/GuestGuard'
// import { ErrorMessage } from '@/components/common/ErrorMessage'
// import { SuccessMessage } from '@/components/common/SuccessMessage'
// import { LoadingSpinner } from '@/components/common/LoadingSpinner'
// import { useAppDispatch, useAppSelector } from '@/lib/hooks'
// import { register, clearError, resetEmailVerificationStatus } from '@/redux/slices/authSlice'
// import { PASSWORD_MIN_LENGTH, USERNAME_MIN_LENGTH } from '@/utils/constants'

// interface FormErrors {
//   email?: string
//   username?: string
//   password?: string
//   confirmPassword?: string
// }

// export default function RegisterPage() {
//   const router = useRouter()
//   const dispatch = useAppDispatch()
//   const { isLoading, isAuthenticated, error, isEmailVerificationSent } = useAppSelector((state) => state.auth)

//   const [formData, setFormData] = useState({
//     email: '',
//     username: '',
//     password: '',
//     confirmPassword: '',
//   })
//   const [formErrors, setFormErrors] = useState<FormErrors>({})
//   const [showError, setShowError] = useState(false)
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//   const [isFocused, setIsFocused] = useState({ email: false, username: false, password: false, confirmPassword: false })
//   const [passwordStrength, setPasswordStrength] = useState(0)
//   const [isFormValid, setIsFormValid] = useState(false)

//   useEffect(() => {
//     if (isAuthenticated) {
//       router.push('/dashboard')
//     }
//   }, [isAuthenticated, router])

//   useEffect(() => {
//     if (error) {
//       setShowError(true)
//     }
//   }, [error])

//   // Check password strength
//   useEffect(() => {
//     const checkStrength = (password: string) => {
//       let strength = 0
//       if (password.length >= 8) strength++
//       if (password.match(/[a-z]+/)) strength++
//       if (password.match(/[A-Z]+/)) strength++
//       if (password.match(/[0-9]+/)) strength++
//       if (password.match(/[$@#&!]+/)) strength++
//       return strength
//     }
//     setPasswordStrength(checkStrength(formData.password))
//   }, [formData.password])

//   // Check form validity for button animation
//   useEffect(() => {
//     const isValid = 
//       formData.email.length > 0 &&
//       formData.username.length >= USERNAME_MIN_LENGTH &&
//       formData.password.length >= PASSWORD_MIN_LENGTH &&
//       formData.password === formData.confirmPassword &&
//       !formErrors.email &&
//       !formErrors.username &&
//       !formErrors.password &&
//       !formErrors.confirmPassword
//     setIsFormValid(isValid)
//   }, [formData, formErrors])

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
    
//     // Clear field-specific errors
//     if (formErrors[name as keyof FormErrors]) {
//       setFormErrors((prev) => {
//         const newErrors = { ...prev }
//         delete newErrors[name as keyof FormErrors]
//         return newErrors
//       })
//     }
    
//     if (error) {
//       dispatch(clearError())
//       setShowError(false)
//     }
//   }

//   const validateForm = (): boolean => {
//     const errors: FormErrors = {}

//     if (!formData.email) {
//       errors.email = 'Email is required'
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       errors.email = 'Please enter a valid email address'
//     }

//     if (!formData.username) {
//       errors.username = 'Username is required'
//     } else if (formData.username.length < USERNAME_MIN_LENGTH) {
//       errors.username = `Username must be at least ${USERNAME_MIN_LENGTH} characters`
//     }

//     if (!formData.password) {
//       errors.password = 'Password is required'
//     } else if (formData.password.length < PASSWORD_MIN_LENGTH) {
//       errors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters`
//     } else if (passwordStrength < 3) {
//       errors.password = 'Password is too weak. Please make it stronger.'
//     }

//     if (!formData.confirmPassword) {
//       errors.confirmPassword = 'Please confirm your password'
//     } else if (formData.password !== formData.confirmPassword) {
//       errors.confirmPassword = 'Passwords do not match'
//     }

//     setFormErrors(errors)
//     return Object.keys(errors).length === 0
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
    
//     if (!validateForm()) {
//       return
//     }

//     const { confirmPassword, ...registerData } = formData
    
//     try {
//       await dispatch(register(registerData)).unwrap()
//       // Success message will be shown via isEmailVerificationSent state
//     } catch (error) {
//       // Error is handled by the slice
//     }
//   }

//   // Get strength info
//   const getStrengthInfo = () => {
//     if (passwordStrength === 0) return { color: 'bg-gray-200', text: 'No password', width: '0%' }
//     if (passwordStrength === 1) return { color: 'bg-red-500', text: 'Weak', width: '20%' }
//     if (passwordStrength === 2) return { color: 'bg-orange-500', text: 'Fair', width: '40%' }
//     if (passwordStrength === 3) return { color: 'bg-yellow-500', text: 'Good', width: '60%' }
//     if (passwordStrength === 4) return { color: 'bg-blue-500', text: 'Strong', width: '80%' }
//     return { color: 'bg-green-500', text: 'Very Strong', width: '100%' }
//   }

//   const strengthInfo = getStrengthInfo()

//   if (isEmailVerificationSent) {
//     return (
//       <GuestGuard>
//         <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.5, type: "spring" }}
//             className="max-w-md w-full bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20 text-center"
//           >
//             <motion.div
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
//               className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg"
//             >
//               <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//               </svg>
//             </motion.div>
            
//             <motion.h2
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//               className="mt-6 text-3xl font-extrabold text-gray-900"
//             >
//               Check your email! 📧
//             </motion.h2>
            
//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.3 }}
//               className="mt-2 text-sm text-gray-600"
//             >
//               We've sent a verification link to <strong className="text-green-600">{formData.email}</strong>
//             </motion.p>
            
//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.4 }}
//               className="mt-2 text-sm text-gray-500"
//             >
//               Please check your inbox and click the verification link to activate your account.
//             </motion.p>
            
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.5 }}
//               className="mt-6 space-y-3"
//             >
//               <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <Link
//                   href="/login"
//                   className="inline-block w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
//                   onClick={() => dispatch(resetEmailVerificationStatus())}
//                 >
//                   Go to Login
//                 </Link>
//               </motion.div>
//               <p className="text-xs text-gray-500">
//                 Didn't receive the email? Check your spam folder or{' '}
//                 <button
//                   onClick={() => dispatch(resetEmailVerificationStatus())}
//                   className="text-green-600 hover:text-green-500 font-medium hover:underline"
//                 >
//                   try again
//                 </button>
//               </p>
//             </motion.div>
//           </motion.div>
//         </div>
//       </GuestGuard>
//     )
//   }

//   return (
//     <GuestGuard>
//       <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//         <motion.div
//           initial={{ opacity: 0, y: -30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
//           className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20"
//         >
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 1 }}
//             className="absolute -z-10 right-0 top-0"
//           >
//             <div className="absolute top-10 left-10 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-pulse" />
//             <div className="absolute bottom-10 right-10 w-16 h-16 bg-emerald-200 rounded-full opacity-20 animate-pulse delay-1000" />
//             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-100 rounded-full opacity-10 animate-pulse delay-500" />
//           </motion.div>
//           {/* Logo/Icon Section */}
//           <motion.div
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ duration: 0.5, type: "spring", stiffness: 200, delay: 0.1 }}
//             className="text-center"
//           >
//             <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
//               <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
//               </svg>
//             </div>
//             <motion.h2
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.2 }}
//               className="mt-4 text-3xl font-extrabold text-gray-900"
//             >
//               Start Your Garden 🌿
//             </motion.h2>
//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.3 }}
//               className="mt-2 text-sm text-gray-600"
//             >
//               Create your account and begin your journey
//             </motion.p>
//           </motion.div>

//           <motion.form
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.4 }}
//             className="mt-8 space-y-6"
//             onSubmit={handleSubmit}
//           >
//             <div className="space-y-4">
//               {/* Email Field */}
//               <motion.div
//                 initial={{ x: -20, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 transition={{ delay: 0.5 }}
//               >
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                   Email Address
//                 </label>
//                 <div className={`relative rounded-xl transition-all duration-300 ${
//                   isFocused.email ? 'ring-2 ring-green-500 shadow-lg' : 'ring-1 ring-gray-200'
//                 } ${formErrors.email ? 'ring-2 ring-red-500' : ''}`}>
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                     </svg>
//                   </div>
//                   <input
//                     id="email"
//                     name="email"
//                     type="email"
//                     autoComplete="email"
//                     required
//                     value={formData.email}
//                     onChange={handleChange}
//                     onFocus={() => setIsFocused({ ...isFocused, email: true })}
//                     onBlur={() => setIsFocused({ ...isFocused, email: false })}
//                     className="appearance-none block w-full pl-10 pr-3 py-3 border-0 bg-white/50 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-0 transition-colors duration-200"
//                     placeholder="Enter your email"
//                   />
//                 </div>
//                 <AnimatePresence>
//                   {formErrors.email && (
//                     <motion.p
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -10 }}
//                       className="mt-1 text-sm text-red-600"
//                     >
//                       {formErrors.email}
//                     </motion.p>
//                   )}
//                 </AnimatePresence>
//               </motion.div>

//               {/* Username Field */}
//               <motion.div
//                 initial={{ x: -20, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 transition={{ delay: 0.55 }}
//               >
//                 <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
//                   Username
//                 </label>
//                 <div className={`relative rounded-xl transition-all duration-300 ${
//                   isFocused.username ? 'ring-2 ring-green-500 shadow-lg' : 'ring-1 ring-gray-200'
//                 } ${formErrors.username ? 'ring-2 ring-red-500' : ''}`}>
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                     </svg>
//                   </div>
//                   <input
//                     id="username"
//                     name="username"
//                     type="text"
//                     autoComplete="username"
//                     required
//                     value={formData.username}
//                     onChange={handleChange}
//                     onFocus={() => setIsFocused({ ...isFocused, username: true })}
//                     onBlur={() => setIsFocused({ ...isFocused, username: false })}
//                     className="appearance-none block w-full pl-10 pr-3 py-3 border-0 bg-white/50 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-0 transition-colors duration-200"
//                     placeholder="Choose a username"
//                   />
//                 </div>
//                 <AnimatePresence>
//                   {formErrors.username && (
//                     <motion.p
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -10 }}
//                       className="mt-1 text-sm text-red-600"
//                     >
//                       {formErrors.username}
//                     </motion.p>
//                   )}
//                 </AnimatePresence>
//               </motion.div>

//               {/* Password Field */}
//               <motion.div
//                 initial={{ x: -20, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 transition={{ delay: 0.6 }}
//               >
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                   Password
//                 </label>
//                 <div className={`relative rounded-xl transition-all duration-300 ${
//                   isFocused.password ? 'ring-2 ring-green-500 shadow-lg' : 'ring-1 ring-gray-200'
//                 } ${formErrors.password ? 'ring-2 ring-red-500' : ''}`}>
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                     </svg>
//                   </div>
//                   <input
//                     id="password"
//                     name="password"
//                     type={showPassword ? "text" : "password"}
//                     autoComplete="new-password"
//                     required
//                     value={formData.password}
//                     onChange={handleChange}
//                     onFocus={() => setIsFocused({ ...isFocused, password: true })}
//                     onBlur={() => setIsFocused({ ...isFocused, password: false })}
//                     className="appearance-none block w-full pl-10 pr-12 py-3 border-0 bg-white/50 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-0 transition-colors duration-200"
//                     placeholder="Create a strong password"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-green-600 transition-colors"
//                   >
//                     {showPassword ? (
//                       <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                       </svg>
//                     ) : (
//                       <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                       </svg>
//                     )}
//                   </button>
//                 </div>

//                 {/* Password Strength Indicator */}
//                 {formData.password && (
//                   <motion.div
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: 'auto' }}
//                     transition={{ duration: 0.3 }}
//                     className="mt-2"
//                   >
//                     <div className="flex items-center justify-between mb-1">
//                       <span className="text-xs font-medium text-gray-700">Password Strength</span>
//                       <motion.span
//                         key={strengthInfo.text}
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         className={`text-xs font-medium ${
//                           passwordStrength <= 2 ? 'text-red-600' :
//                           passwordStrength === 3 ? 'text-yellow-600' :
//                           passwordStrength === 4 ? 'text-blue-600' :
//                           'text-green-600'
//                         }`}
//                       >
//                         {strengthInfo.text}
//                       </motion.span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
//                       <motion.div
//                         initial={{ width: 0 }}
//                         animate={{ width: strengthInfo.width }}
//                         transition={{ duration: 0.5, type: "spring" }}
//                         className={`h-2 rounded-full ${strengthInfo.color}`}
//                       />
//                     </div>
//                     <motion.ul
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       transition={{ delay: 0.1 }}
//                       className="mt-2 space-y-1 text-xs"
//                     >
//                       {[
//                         { check: formData.password.length >= 8, text: 'At least 8 characters' },
//                         { check: /[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password), text: 'Uppercase & lowercase' },
//                         { check: /[0-9]/.test(formData.password), text: 'Contains a number' },
//                         { check: /[$@#&!]/.test(formData.password), text: 'Special character ($@#&!)' },
//                       ].map((item, index) => (
//                         <motion.li
//                           key={index}
//                           initial={{ opacity: 0, x: -10 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           transition={{ delay: 0.1 * index }}
//                           className={`flex items-center ${item.check ? 'text-green-600' : 'text-gray-400'}`}
//                         >
//                           {item.check ? (
//                             <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                               <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                             </svg>
//                           ) : (
//                             <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                               <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                             </svg>
//                           )}
//                           {item.text}
//                         </motion.li>
//                       ))}
//                     </motion.ul>
//                   </motion.div>
//                 )}
//                 <AnimatePresence>
//                   {formErrors.password && (
//                     <motion.p
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -10 }}
//                       className="mt-1 text-sm text-red-600"
//                     >
//                       {formErrors.password}
//                     </motion.p>
//                   )}
//                 </AnimatePresence>
//               </motion.div>

//               {/* Confirm Password Field */}
//               <motion.div
//                 initial={{ x: -20, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 transition={{ delay: 0.65 }}
//               >
//                 <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
//                   Confirm Password
//                 </label>
//                 <div className={`relative rounded-xl transition-all duration-300 ${
//                   isFocused.confirmPassword ? 'ring-2 ring-green-500 shadow-lg' : 'ring-1 ring-gray-200'
//                 } ${formErrors.confirmPassword ? 'ring-2 ring-red-500' : ''}`}>
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                     </svg>
//                   </div>
//                   <input
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     type={showConfirmPassword ? "text" : "password"}
//                     autoComplete="new-password"
//                     required
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     onFocus={() => setIsFocused({ ...isFocused, confirmPassword: true })}
//                     onBlur={() => setIsFocused({ ...isFocused, confirmPassword: false })}
//                     className="appearance-none block w-full pl-10 pr-12 py-3 border-0 bg-white/50 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-0 transition-colors duration-200"
//                     placeholder="Confirm your password"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-green-600 transition-colors"
//                   >
//                     {showConfirmPassword ? (
//                       <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                       </svg>
//                     ) : (
//                       <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                       </svg>
//                     )}
//                   </button>
//                 </div>
//                 <AnimatePresence>
//                   {formErrors.confirmPassword && (
//                     <motion.p
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -10 }}
//                       className="mt-1 text-sm text-red-600"
//                     >
//                       {formErrors.confirmPassword}
//                     </motion.p>
//                   )}
//                 </AnimatePresence>
//               </motion.div>
//             </div>

//             <AnimatePresence>
//               {showError && error && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <ErrorMessage
//                     message={error}
//                     onDismiss={() => {
//                       setShowError(false)
//                       dispatch(clearError())
//                     }}
//                   />
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: 0.7 }}
//             >
//               <motion.button
//                 whileHover={isFormValid ? { scale: 1.02 } : {}}
//                 whileTap={isFormValid ? { scale: 0.98 } : {}}
//                 type="submit"
//                 disabled={isLoading || !isFormValid}
//                 className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white transition-all duration-300 shadow-lg ${
//                   isFormValid 
//                     ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl cursor-pointer' 
//                     : 'bg-gray-400 cursor-not-allowed opacity-50'
//                 }`}
//               >
//                 {isLoading ? (
//                   <LoadingSpinner size="sm" />
//                 ) : (
//                   <>
//                     <span>Create Account</span>
//                     <motion.svg
//                       className="ml-2 h-5 w-5"
//                       initial={{ x: 0 }}
//                       animate={{ x: 0 }}
//                       whileHover={{ x: 5 }}
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                     </motion.svg>
//                   </>
//                 )}
//               </motion.button>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.8 }}
//               className="text-center"
//             >
//               <p className="text-sm text-gray-600">
//                 Already have an account?{" "}
//                 <Link href="/login" className="font-medium text-green-600 hover:text-green-500 transition-colors duration-200 hover:underline">
//                   Sign in instead
//                 </Link>
//               </p>
//               <p className="mt-2 text-xs text-gray-500">
//                 By creating an account, you agree to our Terms of Service and Privacy Policy.
//               </p>
//             </motion.div>
//           </motion.form>

//           {/* Decorative Elements */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 1 }}
//             className="absolute -z-10 top-170"
//           >
//             <div className="absolute top-10 left-10 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-pulse" />
//             <div className="absolute bottom-10 right-10 w-16 h-16 bg-emerald-200 rounded-full opacity-20 animate-pulse delay-1000" />
//             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-100 rounded-full opacity-10 animate-pulse delay-500" />
//           </motion.div>
//         </motion.div>
//       </div>
//     </GuestGuard>
//   )
// }

















// app/(auth)/register/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { GuestGuard } from '@/components/auth/GuestGuard'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { register, clearError, resetEmailVerificationStatus } from '@/redux/slices/authSlice'
import { PASSWORD_MIN_LENGTH, USERNAME_MIN_LENGTH } from '@/utils/constants'
import { showErrorToast, showSuccessToast, showLoadingToast } from '@/utils/toast'

interface FormErrors {
  email?: string
  username?: string
  password?: string
  confirmPassword?: string
}

export default function RegisterPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isLoading, isAuthenticated, error, isEmailVerificationSent } = useAppSelector((state) => state.auth)

  // const PASSWORD_MIN_LENGTH= process.env.PASSWORD_MIN_LENGTH

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isFocused, setIsFocused] = useState({ email: false, username: false, password: false, confirmPassword: false })
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [showStrengthIndicator, setShowStrengthIndicator] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      showSuccessToast('Welcome to your new garden! 🌿')
      router.push('/login')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (error) {
      showErrorToast(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  // Check password strength
  useEffect(() => {
    const checkStrength = (password: string) => {
      let strength = 0
      if (password.length >= 8) strength++
      if (password.match(/[a-z]+/)) strength++
      if (password.match(/[A-Z]+/)) strength++
      if (password.match(/[0-9]+/)) strength++
      if (password.match(/[$@#&!]+/)) strength++
      return strength
    }
    setPasswordStrength(checkStrength(formData.password))
  }, [formData.password])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Clear field-specific errors
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name as keyof FormErrors]
        return newErrors
      })
    }
    
    // Show strength indicator when password has value
    if (name === 'password' && value.length > 0) {
      setShowStrengthIndicator(true)
    } else if (name === 'password' && value.length === 0) {
      setShowStrengthIndicator(false)
    }
  }

  const checkPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (password.match(/[a-z]+/)) strength++
    if (password.match(/[A-Z]+/)) strength++
    if (password.match(/[0-9]+/)) strength++
    if (password.match(/[$@#&!]+/)) strength++
    return strength
  }

  const validateForm = (): boolean => {
    const errors: FormErrors = {}

    if (!formData.email) {
      errors.email = 'Email is required'
      showErrorToast('Email is required')
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
      showErrorToast('Please enter a valid email address')
    }

    if (!formData.username) {
      errors.username = 'Username is required'
      showErrorToast('Username is required')
    } else if (formData.username.length < USERNAME_MIN_LENGTH) {
      errors.username = `Username must be at least ${USERNAME_MIN_LENGTH} characters`
      showErrorToast(`Username must be at least ${USERNAME_MIN_LENGTH} characters`)
    }

    if (!formData.password) {
      errors.password = 'Password is required'
      showErrorToast('Password is required')
    } else if (formData.password.length < PASSWORD_MIN_LENGTH) {
      errors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters`
      showErrorToast(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
    } else {
      const strength = checkPasswordStrength(formData.password)
      if (strength < 3) {
        errors.password = 'Password is too weak. Please make it stronger.'
        showErrorToast('Password is too weak. Include uppercase, lowercase, numbers, and special characters.')
        return false
      }
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
      showErrorToast('Please confirm your password')
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
      showErrorToast('Passwords do not match')
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const loadingToast = showLoadingToast('Creating your account...')
    const { confirmPassword, ...registerData } = formData
    
    try {
      await dispatch(register(registerData)).unwrap()
      toast.dismiss(loadingToast)
      showSuccessToast('Account created! Check your email for verification. 📧')
      // Success message will be shown via isEmailVerificationSent state
    } catch (error: any) {
      toast.dismiss(loadingToast)
      // Error is handled by the slice
    }
  }

  // Get strength info
  const getStrengthInfo = () => {
    if (passwordStrength === 0) return { color: 'bg-gray-200', text: 'No password', width: '0%' }
    if (passwordStrength === 1) return { color: 'bg-red-500', text: 'Weak', width: '20%' }
    if (passwordStrength === 2) return { color: 'bg-orange-500', text: 'Fair', width: '40%' }
    if (passwordStrength === 3) return { color: 'bg-yellow-500', text: 'Good', width: '60%' }
    if (passwordStrength === 4) return { color: 'bg-blue-500', text: 'Strong', width: '80%' }
    return { color: 'bg-green-500', text: 'Very Strong', width: '100%' }
  }

  const strengthInfo = getStrengthInfo()

  if (isEmailVerificationSent) {
    return (
      <GuestGuard>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="max-w-md w-full bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
              className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg"
            >
              <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-3xl font-extrabold text-gray-900"
            >
              Check your email! 📧
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-2 text-sm text-gray-600"
            >
              We've sent a verification link to <strong className="text-green-600">{formData.email}</strong>
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-2 text-sm text-gray-500"
            >
              Please check your inbox and click the verification link to activate your account.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 space-y-3"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/login"
                  className="inline-block w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={() => {
                    dispatch(resetEmailVerificationStatus())
                    showSuccessToast('Redirecting to login...')
                  }}
                >
                  Go to Login
                </Link>
              </motion.div>
              <p className="text-xs text-gray-500">
                Didn't receive the email? Check your spam folder or{' '}
                <button
                  onClick={() => {
                    dispatch(resetEmailVerificationStatus())
                  }}
                  className="text-green-600 hover:text-green-500 font-medium hover:underline"
                >
                  try again
                </button>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </GuestGuard>
    )
  }

  return (
    <GuestGuard>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20"
        >
          {/* Logo/Icon Section */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200, delay: 0.1 }}
            className="text-center"
          >
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
              <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-3xl font-extrabold text-gray-900"
            >
              Start Your Garden 🌿
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-2 text-sm text-gray-600"
            >
              Create your account and begin your journey
            </motion.p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="space-y-4">
              {/* Email Field */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className={`relative rounded-xl transition-all duration-300 ${
                  isFocused.email ? 'ring-2 ring-green-500 shadow-lg' : 'ring-1 ring-gray-200'
                } ${formErrors.email ? 'ring-2 ring-red-500' : ''}`}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setIsFocused({ ...isFocused, email: true })}
                    onBlur={() => setIsFocused({ ...isFocused, email: false })}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border-0 bg-white/50 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-0 transition-colors duration-200"
                    placeholder="Enter your email"
                  />
                </div>
              </motion.div>

              {/* Username Field */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.55 }}
              >
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className={`relative rounded-xl transition-all duration-300 ${
                  isFocused.username ? 'ring-2 ring-green-500 shadow-lg' : 'ring-1 ring-gray-200'
                } ${formErrors.username ? 'ring-2 ring-red-500' : ''}`}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    onFocus={() => setIsFocused({ ...isFocused, username: true })}
                    onBlur={() => setIsFocused({ ...isFocused, username: false })}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border-0 bg-white/50 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-0 transition-colors duration-200"
                    placeholder="Choose a username"
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className={`relative rounded-xl transition-all duration-300 ${
                  isFocused.password ? 'ring-2 ring-green-500 shadow-lg' : 'ring-1 ring-gray-200'
                } ${formErrors.password ? 'ring-2 ring-red-500' : ''}`}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setIsFocused({ ...isFocused, password: true })}
                    onBlur={() => setIsFocused({ ...isFocused, password: false })}
                    className="appearance-none block w-full pl-10 pr-12 py-3 border-0 bg-white/50 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-0 transition-colors duration-200"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-green-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator - only shows when typing */}
                {showStrengthIndicator && formData.password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="mt-2"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">Password Strength</span>
                      <motion.span
                        key={strengthInfo.text}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`text-xs font-medium ${
                          passwordStrength <= 2 ? 'text-red-600' :
                          passwordStrength === 3 ? 'text-yellow-600' :
                          passwordStrength === 4 ? 'text-blue-600' :
                          'text-green-600'
                        }`}
                      >
                        {strengthInfo.text}
                      </motion.span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: strengthInfo.width }}
                        transition={{ duration: 0.5, type: "spring" }}
                        className={`h-2 rounded-full ${strengthInfo.color}`}
                      />
                    </div>
                    <motion.ul
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="mt-2 space-y-1 text-xs"
                    >
                      {[
                        { check: formData.password.length >= 8, text: 'At least 8 characters' },
                        { check: /[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password), text: 'Uppercase & lowercase' },
                        { check: /[0-9]/.test(formData.password), text: 'Contains a number' },
                        { check: /[$@#&!]/.test(formData.password), text: 'Special character ($@#&!)' },
                      ].map((item, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className={`flex items-center ${item.check ? 'text-green-600' : 'text-gray-400'}`}
                        >
                          {item.check ? (
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          )}
                          {item.text}
                        </motion.li>
                      ))}
                    </motion.ul>
                  </motion.div>
                )}
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.65 }}
              >
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className={`relative rounded-xl transition-all duration-300 ${
                  isFocused.confirmPassword ? 'ring-2 ring-green-500 shadow-lg' : 'ring-1 ring-gray-200'
                } ${formErrors.confirmPassword ? 'ring-2 ring-red-500' : ''}`}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setIsFocused({ ...isFocused, confirmPassword: true })}
                    onBlur={() => setIsFocused({ ...isFocused, confirmPassword: false })}
                    className="appearance-none block w-full pl-10 pr-12 py-3 border-0 bg-white/50 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-0 transition-colors duration-200"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-green-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <motion.svg
                      className="ml-2 h-5 w-5"
                      initial={{ x: 0 }}
                      animate={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </motion.svg>
                  </>
                )}
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center"
            >
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-green-600 hover:text-green-500 transition-colors duration-200 hover:underline">
                  Sign in instead
                </Link>
              </p>
              <p className="mt-2 text-xs text-gray-500">
                By creating an account, you agree to our Terms of Service and Privacy Policy.
              </p>
            </motion.div>
          </motion.form>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute -z-10"
          >
            <div className="absolute top-10 left-10 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-pulse" />
            <div className="absolute bottom-10 right-10 w-16 h-16 bg-emerald-200 rounded-full opacity-20 animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-100 rounded-full opacity-10 animate-pulse delay-500" />
          </motion.div>
        </motion.div>
      </div>
    </GuestGuard>
  )
}