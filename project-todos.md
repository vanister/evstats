# EVStats Project TODOs

This document tracks all identified improvements and features for the EVStats Ionic app, organized by screen then priority.

## VehicleScreen

### 🔥 High Priority - Core Functionality
- [x] Implement session deletion warning in vehicle delete confirmation
- [x] Fix type safety by making Vehicle fields optional (year, batterySize, range)
- [x] Fix Last Charge date to show most recent date instead of latest entry
- [x] Fix date display timezone issues
- [x] Review error handling for vehicle operations
- [x] Test edge cases for vehicle CRUD operations
- [x] Add proper loading states for vehicle operations
- [x] Improve error messages to be more specific

### 🎯 Medium Priority - Essential UX
- [ ] Add pull-to-refresh for vehicle stats
- [ ] Add confirmation dialogs for destructive actions
- [ ] Add haptic feedback for vehicle interactions

### 📈 Lower Priority - Enhanced Features
- [ ] Add search/filter functionality for multiple vehicles
- [ ] Add sort options (name, year, last used, etc.)
- [ ] Add swipe actions for edit/delete
- [ ] Add context menu with long-press
- [ ] Add vehicle reordering (drag & drop)
- [ ] Add vehicle grouping (by make, year, categories)
- [ ] Add bulk operations (select multiple vehicles)
- [ ] Add secondary favorites beyond just default vehicle
- [ ] Add vehicle image/photo support
- [ ] Add VIN decoder for auto-populating vehicle details
- [ ] Add import options from other apps/services
- [ ] Add sharing functionality for vehicle info

## SessionScreen

### 🔥 High Priority - Core Functionality
- [x] Review SessionScreen for missing functionality or bugs
- [x] Check date parsing issues in session forms
- [x] Ensure session CRUD operations work correctly
- [x] Test session validation and error handling
- [x] Add loading states for session operations

### 🎯 Medium Priority - Essential UX
- [ ] Add pull-to-refresh for session list
- [ ] Improve session form validation feedback
- [ ] Add haptic feedback for session interactions

### 📈 Lower Priority - Enhanced Features
- [ ] Add search/filter functionality for sessions
- [ ] Add sort options for session list
- [ ] Add swipe actions for session items
- [ ] Add bulk operations for sessions
- [ ] Add session templates or quick-add presets
- [ ] Add session location tracking
- [ ] Add session photos/notes
- [ ] Add session export functionality

## ChargeStatsScreen

### 🔥 High Priority - Core Functionality
- [ ] Review ChargeStatsScreen for missing functionality or bugs
- [ ] Check chart data accuracy and performance
- [ ] Ensure stats calculations are correct
- [ ] Test date range filtering
- [ ] Add loading states for chart data

### 🎯 Medium Priority - Essential UX
- [ ] Add pull-to-refresh for chart data
- [ ] Improve chart loading and error states
- [ ] Add haptic feedback for chart interactions

### 📈 Lower Priority - Enhanced Features
- [ ] Add more detailed statistics and metrics
- [ ] Add date range selection for charts
- [ ] Add different chart types (pie, line, bar)
- [ ] Add comparison views (vehicle vs vehicle, period vs period)
- [ ] Add export functionality for charts and data
- [ ] Add usage trends and predictions
- [ ] Add cost analysis and savings calculations
- [ ] Add carbon footprint calculations

## SettingsScreen

### 🔥 High Priority - Core Functionality
- [ ] Review SettingsScreen for missing functionality or bugs
- [ ] Test settings persistence
- [ ] Ensure proper validation of settings
- [ ] Check backup/restore functionality

### 🎯 Medium Priority - Essential UX
- [ ] Add confirmation dialogs for destructive settings
- [ ] Improve settings form validation
- [ ] Add haptic feedback for settings changes

### 📈 Lower Priority - Enhanced Features
- [ ] Add data export/backup functionality
- [ ] Add data import functionality
- [ ] Add theme customization options
- [ ] Add notification preferences
- [ ] Add privacy and security settings
- [ ] Add about/help section
- [ ] Add user profile management

## Global/Infrastructure

### 🔥 High Priority - Core Functionality
- [x] Standardize preference keys with consistent naming convention
- [x] Convert ChargeColors to enum for better type safety
- [x] Integrate date-fns for robust date handling with centralized API
- [ ] Ensure all database queries are optimized
- [ ] Review error handling patterns across all screens
- [ ] Test and fix any type safety issues in other models
- [ ] Implement proper data validation for all forms
- [ ] Ensure foreign key constraints are working properly
- [ ] Add data migration scripts if needed

### 🎯 Medium Priority - Essential UX
- [ ] Ensure keyboard handling works properly on all forms
- [ ] Test touch interactions and gesture support
- [ ] Add proper loading states for all async operations

## 🚀 Future Features

### New Screens/Features
- [ ] Add Reports/Analytics screen
- [ ] Add Charging Locations screen
- [ ] Add Rate Management screen (if not in Settings)
- [ ] Add Help/Tutorial screens

### Advanced Features
- [ ] Multi-user support
- [ ] Cloud sync across devices
- [ ] Advanced analytics and reporting
- [ ] Integration with charging networks
- [ ] Geolocation features for charging locations
- [ ] Push notifications for charging reminders
- [ ] Widget support for home screen
- [ ] Apple Watch / WearOS companion app
- [ ] API for third-party integrations

---

## Current Focus

**Next Priority**: ChargeStatsScreen - High Priority Core Functionality items

**Screen Progress**:
1. **VehicleScreen** ✅ - Core functionality complete
2. **SessionScreen** ✅ - Core functionality complete
3. **ChargeStatsScreen** 🔄 - Next for review
4. **SettingsScreen** ⏳ - Then review

---

## Notes

- **Focus Priority**: Core functionality and critical bugs first
- **Screen-by-Screen**: Complete each screen's core functionality before moving to enhancements
- **Mobile-First**: All features should work well on mobile devices
- **Performance**: Keep app responsive and efficient
- **Data Safety**: Protect user data with proper validation and error handling

Last Updated: 2025-08-05