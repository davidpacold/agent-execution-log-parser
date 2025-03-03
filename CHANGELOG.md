# Changelog

All notable changes to this project will be documented in this file.

## [1.0.2] - 2025-03-03

### Fixed
- GitHub Actions deployment workflow using direct Wrangler commands
- API token validation in deployment workflow
- Improved error handling in CI/CD pipeline

## [1.0.1] - 2025-03-03

### Added
- Environment variables support for configurable settings
- Request timing and performance monitoring
- Enhanced logging with environment context
- Consolidated GitHub Actions workflow with improved CI/CD pipeline
- Test results artifact upload in GitHub Actions
- Better PR comments with deployment information

### Changed
- Updated Wrangler configuration with modern Cloudflare Workers features
- Improved error handling with better context information
- Streamlined GitHub Actions workflow to prevent duplicate runs

### Fixed
- Removed deprecated `usage_model` from wrangler.toml configuration
- Fixed request timing implementation for better test compatibility
- Optimized environment variable handling

## [1.0.0] - 2025-03-02

### Added
- Comprehensive error handling with standardized error types
- Size validation for log files
- Format detection for different log types
- GitHub Actions CI workflow
- Prettier configuration
- Additional documentation (README, IMPROVEMENTS.md)
- Detailed JSDoc comments for all functions

### Changed
- Refactored codebase into modular architecture
- Eliminated code duplication between client and server parsers
- Improved date and time formatting
- Enhanced JSON handling and validation
- Updated package.json with proper metadata
- Consolidated Wrangler configuration

### Fixed
- Error handling in log parser
- Date formatting edge cases
- Package dependencies consistency
- JSON parsing error handling
- Test suite with proper test cases

### Removed
- Duplicate wrangler.jsonc file
- Redundant code between client and server