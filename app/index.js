import { Redirect } from 'expo-router';

export default function Index() {
  // For testing purposes, redirect to the test intro page
  // Set this to false when ready for production
  const isDevelopment = true;
  
  if (isDevelopment) {
    return <Redirect href="/test-intro" />;
  }
  
  // In a real app, check if user is logged in
  const isLoggedIn = false;
  
  if (isLoggedIn) {
    return <Redirect href="/main" />;
  }
  return <Redirect href="/auth" />;
}
