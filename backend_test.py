import requests
import sys
from datetime import datetime
import json

class SchoolAPITester:
    def __init__(self, base_url="https://cgtech-school.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.errors = []

    def run_test(self, name, method, endpoint, expected_status, data=None, timeout=30):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}" if endpoint else self.base_url
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=timeout)

            print(f"   Status Code: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                
                # Try to parse JSON response
                try:
                    response_data = response.json()
                    if isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                        if len(response_data) > 0:
                            print(f"   First item keys: {list(response_data[0].keys()) if isinstance(response_data[0], dict) else 'Not a dict'}")
                    elif isinstance(response_data, dict):
                        print(f"   Response keys: {list(response_data.keys())}")
                    else:
                        print(f"   Response type: {type(response_data)}")
                except:
                    print(f"   Response (text): {response.text[:200]}...")
                    
                return True, response.text
            else:
                error_msg = f"Expected {expected_status}, got {response.status_code}"
                print(f"❌ Failed - {error_msg}")
                print(f"   Response: {response.text[:500]}")
                self.errors.append(f"{name}: {error_msg}")
                return False, response.text

        except requests.exceptions.Timeout:
            error_msg = f"Request timed out after {timeout} seconds"
            print(f"❌ Failed - {error_msg}")
            self.errors.append(f"{name}: {error_msg}")
            return False, ""
        except Exception as e:
            error_msg = f"Error: {str(e)}"
            print(f"❌ Failed - {error_msg}")
            self.errors.append(f"{name}: {error_msg}")
            return False, ""

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        success, response = self.run_test(
            "Root API Endpoint",
            "GET",
            "",
            200
        )
        return success

    def test_notices_endpoint(self):
        """Test the notices endpoint - core Google Sheets integration"""
        success, response = self.run_test(
            "Notices Endpoint (Google Sheets Integration)",
            "GET",
            "notices",
            200,
            timeout=45  # Longer timeout for external API call
        )
        
        if success:
            try:
                notices_data = json.loads(response)
                if isinstance(notices_data, list) and len(notices_data) > 0:
                    print(f"   ✅ Successfully fetched {len(notices_data)} notices")
                    
                    # Validate notice structure
                    first_notice = notices_data[0]
                    required_fields = ['title', 'date', 'description']
                    missing_fields = [field for field in required_fields if field not in first_notice]
                    
                    if not missing_fields:
                        print(f"   ✅ Notice structure is valid")
                        print(f"   Sample notice: {first_notice['title'][:50]}...")
                    else:
                        print(f"   ⚠️  Missing fields in notice: {missing_fields}")
                        self.errors.append(f"Notices: Missing fields {missing_fields}")
                else:
                    print(f"   ⚠️  No notices returned or invalid format")
                    self.errors.append("Notices: No data returned")
            except json.JSONDecodeError:
                print(f"   ❌ Invalid JSON response")
                self.errors.append("Notices: Invalid JSON response")
        
        return success

    def test_status_endpoints(self):
        """Test status check endpoints"""
        # Test GET status
        get_success, _ = self.run_test(
            "Get Status Checks",
            "GET",
            "status",
            200
        )
        
        # Test POST status
        test_data = {
            "client_name": f"test_client_{datetime.now().strftime('%H%M%S')}"
        }
        post_success, _ = self.run_test(
            "Create Status Check",
            "POST",
            "status",
            200,
            data=test_data
        )
        
        return get_success and post_success

    def test_google_sheets_direct(self):
        """Test direct access to Google Sheets CSV"""
        sheets_id = "1FGNgaNGtq4rDewGnVDkGpBbclHx9bFST6FFebRwcGnM"
        csv_url = f"https://docs.google.com/spreadsheets/d/{sheets_id}/export?format=csv"
        
        print(f"\n🔍 Testing Direct Google Sheets Access...")
        print(f"   URL: {csv_url}")
        
        try:
            response = requests.get(csv_url, timeout=30)
            if response.status_code == 200:
                print(f"✅ Google Sheets CSV accessible")
                print(f"   Response length: {len(response.text)} characters")
                
                # Check if it looks like CSV
                lines = response.text.split('\n')[:5]
                print(f"   First few lines:")
                for i, line in enumerate(lines):
                    if line.strip():
                        print(f"     {i+1}: {line[:100]}...")
                
                return True
            else:
                print(f"❌ Google Sheets not accessible - Status: {response.status_code}")
                self.errors.append(f"Google Sheets Direct: Status {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Error accessing Google Sheets: {str(e)}")
            self.errors.append(f"Google Sheets Direct: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all backend tests"""
        print("=" * 60)
        print("🚀 STARTING BACKEND API TESTS")
        print("=" * 60)
        
        # Test Google Sheets direct access first
        sheets_success = self.test_google_sheets_direct()
        
        # Test API endpoints
        root_success = self.test_root_endpoint()
        notices_success = self.test_notices_endpoint()
        status_success = self.test_status_endpoints()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.errors:
            print(f"\n❌ ERRORS FOUND ({len(self.errors)}):")
            for i, error in enumerate(self.errors, 1):
                print(f"   {i}. {error}")
        else:
            print(f"\n✅ ALL TESTS PASSED!")
        
        # Critical assessment
        critical_tests = [sheets_success, notices_success]
        if not all(critical_tests):
            print(f"\n🚨 CRITICAL ISSUES DETECTED:")
            if not sheets_success:
                print("   - Google Sheets integration is not working")
            if not notices_success:
                print("   - Notices API endpoint is failing")
            return False
        else:
            print(f"\n✅ ALL CRITICAL TESTS PASSED")
            return True

def main():
    tester = SchoolAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())