# SauceDemo Exploratory Test Plan

## Application Overview

Exploratory test plan for Sauce Demo (https://www.saucedemo.com). Includes login, cart operations, checkout, sorting, and logout flows. Assumes fresh session for each test.

## Test Scenarios

### 1. SauceDemo Exploratory Suite

**Seed:** `tests/seed.spec.ts`

#### 1.1. Login - Happy Path

**File:** `specs/login-happy-path.md`

**Steps:**
  1. Open https://www.saucedemo.com/
    - expect: Login page loads with username and password fields
  2. Enter username `standard_user` and password `secret_sauce` and submit
    - expect: User is redirected to inventory page
    - expect: Inventory list is visible

#### 1.2. Add and Remove Cart Items

**File:** `specs/add-remove-cart.md`

**Steps:**
  1. From inventory page, add the first product to cart
    - expect: Cart badge shows 1 item
    - expect: Product appears in cart list
  2. Remove the item from cart
    - expect: Cart badge updates to 0 or disappears
    - expect: Cart list no longer contains the product

#### 1.3. Checkout Flow - End-to-end

**File:** `specs/checkout-e2e.md`

**Steps:**
  1. Add at least one product to cart and go to cart
    - expect: Cart shows the selected product(s)
  2. Click `Checkout`, fill `First name`, `Last name`, `Postal code` and continue
    - expect: Overview page shows items and total price
  3. Click `Finish`
    - expect: Order confirmation shows message `Thank you for your order!`

#### 1.4. Sorting and Filters

**File:** `specs/sorting-filters.md`

**Steps:**
  1. Use the product sort dropdown to select `Price (low to high)`
    - expect: Products reorder with lowest price first
  2. Use the product sort dropdown to select `Name (Z to A)`
    - expect: Products reorder alphabetically descending

#### 1.5. Logout and Session Handling

**File:** `specs/logout.md`

**Steps:**
  1. Open the menu (hamburger) and click `Logout`
    - expect: User is returned to the login page
    - expect: Attempting to navigate to inventory without logging in redirects to login
