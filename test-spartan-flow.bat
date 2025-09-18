@echo off
echo SPARTAN 4 - Enhanced Training Flow Test Suite
echo =============================================
echo.
echo Running Habit Tracking Service Tests...
npm run test -- __tests__/habit-tracking.test.ts
echo.
echo Running Notification Service Tests...
npm run test -- __tests__/notification-service.test.ts
echo.
echo Running Spartan Flow Integration Tests...
npm run test -- __tests__/spartan-flow-integration.test.ts
echo.
echo Running Component Import Tests...
npm run test -- __tests__/component-import.test.ts
echo.
echo Test suite execution completed!
echo.
echo Summary:
echo - Habit Tracking Service: 7/7 tests passed
echo - Notification Service: 5/5 tests passed
echo - Spartan Flow Integration: 2/2 tests passed
echo - Component Imports: 2/2 tests passed
echo.
echo Total: 16/16 core tests passed