#!/usr/bin/env python3

import json
import subprocess
import sys
from pathlib import Path

def main():
    """
    Script to run tests and report uncovered files in a specified folder
    Usage: python check_coverage.py [folder-path]
    Example: python check_coverage.py src/components
    """
    
    if len(sys.argv) != 2:
        print("Usage: python check_coverage.py <folder-path>")
        print("Example: python check_coverage.py src/components")
        sys.exit(1)
    
    folder_path = sys.argv[1]
    
    print("Running tests with coverage...")
    
    try:
        # Run tests with coverage, suppress output and input
        subprocess.run(['npm', 'run', 'test'], 
                      stdout=subprocess.DEVNULL, 
                      stderr=subprocess.DEVNULL,
                      stdin=subprocess.DEVNULL,
                      check=True)
        
        # Read coverage results
        coverage_path = Path.cwd() / 'coverage' / 'coverage-final.json'
        
        if not coverage_path.exists():
            print("Coverage file not found. Make sure tests ran successfully.")
            sys.exit(1)
        
        print("Parsing coverage results...")
        
        with open(coverage_path, 'r') as f:
            coverage_data = json.load(f)
        
        # Filter files in the specified folder and check coverage
        uncovered_files = []
        resolved_folder_path = Path(folder_path).resolve()
        
        for file_path, coverage in coverage_data.items():
            # Check if file is in the specified folder
            file_path_obj = Path(file_path).resolve()
            try:
                file_path_obj.relative_to(resolved_folder_path)
                is_in_folder = True
            except ValueError:
                is_in_folder = False
            
            if is_in_folder:
                # V8 coverage format uses s, f, b objects with hit counts
                statements = coverage.get('s', {})
                functions = coverage.get('f', {})
                branches = coverage.get('b', {})
                
                # Calculate coverage percentages for V8 format
                total_statements = len(statements)
                hit_statements = sum(1 for count in statements.values() if count > 0)
                statements_coverage = (hit_statements / total_statements * 100) if total_statements > 0 else 100
                
                total_functions = len(functions)
                hit_functions = sum(1 for count in functions.values() if count > 0)
                functions_coverage = (hit_functions / total_functions * 100) if total_functions > 0 else 100
                
                # For branches, each branch can have multiple paths
                total_branch_paths = sum(len(paths) for paths in branches.values())
                hit_branches = sum(sum(1 for count in paths if count > 0) for paths in branches.values())
                branches_coverage = (hit_branches / total_branch_paths * 100) if total_branch_paths > 0 else 100
                
                # Check if any coverage is less than 100%
                if statements_coverage < 100 or functions_coverage < 100 or branches_coverage < 100:
                    uncovered_files.append({
                        'file': str(Path(file_path).relative_to(Path.cwd())),
                        'statements': round(statements_coverage, 2),
                        'functions': round(functions_coverage, 2),
                        'branches': round(branches_coverage, 2)
                    })
        
        print(f"\n=== Coverage Report for: {folder_path} ===")
        
        if not uncovered_files:
            print("✅ All files in the specified folder have 100% coverage!")
        else:
            print(f"❌ Found {len(uncovered_files)} files with incomplete coverage:\n")
            for file_info in uncovered_files:
                print(f"📄{file_info['file']}")
                print(f"   Functions: {file_info['functions']}% | Statements: {file_info['statements']}% | Branches: {file_info['branches']}%")
        
    except subprocess.CalledProcessError:
        print("Error: Tests failed to run.")
        sys.exit(1)
    except Exception as e:
        print(f"Error running coverage check: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()