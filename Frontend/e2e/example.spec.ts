import { expect, test } from "@playwright/test";

test.describe("CRM Intelligent - E2E Flows", () => {
  
  // ✅ TEST 1: User navigates to login
  test("User navigates to login", async ({ page }) => {
    await page.goto("/");
    
    // Verificar que estamos en Home
    await expect(page).toHaveTitle(/vite/i);
    
    // Hacer click en "Iniciar Sesión" (desktop)
    const loginButton = page.getByRole("button", { name: /Iniciar Sesión/i }).first();
    await expect(loginButton).toBeVisible();
    await loginButton.click();
    
    // Verificar redirección a /login
    await page.waitForURL("/login");
    expect(page.url()).toContain("/login");
    
    // Verificar elementos de la página login
    await expect(page.getByText(/Inicia Sesión/i)).toBeVisible();
    await expect(page.getByPlaceholder(/Correo|Email/i)).toBeVisible();
    await expect(page.getByPlaceholder(/Contraseña/i)).toBeVisible();
  });

  // ✅ TEST 2: User logs in with invalid credentials
  test("User sees error with invalid credentials", async ({ page }) => {
    await page.goto("/login");
    
    // Llenar formulario con credenciales inválidas
    await page.getByPlaceholder(/Correo|Email/i).fill("wrong@example.com");
    await page.getByPlaceholder(/Contraseña/i).fill("123456");
    
    // Submit
    await page.getByRole("button", { name: /Entrar|Iniciar/i }).click();
    
    // Esperar y verificar mensaje de error
    await expect(page.locator("text=Credenciales inválidas")).toBeVisible({ timeout: 2000 });
  });

  // ✅ TEST 3: User logs in with valid credentials and sees dashboard
  test("User logs in and sees dashboard", async ({ page }) => {
    await page.goto("/login");
    
    // Llenar con credenciales válidas
    const emailInput = page.getByPlaceholder(/Correo|Email/i);
    const passwordInput = page.getByPlaceholder(/Contraseña/i);
    const submitButton = page.getByRole("button", { name: /Entrar|Iniciar/i });
    
    await emailInput.fill("admin@crm.com");
    await passwordInput.fill("123456");
    
    // Verificar que el botón está activo
    await expect(submitButton).toBeEnabled();
    
    // Submit
    await submitButton.click();
    
    // Verificar redirección a dashboard
    await page.waitForURL("/dashboard", { timeout: 5000 });
    expect(page.url()).toContain("/dashboard");
    
    // Verificar elementos del dashboard
    await expect(page.getByText(/Panel de Control General/i)).toBeVisible();
    await expect(page.getByText(/Resumen operativo/i)).toBeVisible();
    
    // Verificar que el token está guardado
    const token = await page.evaluate(() => localStorage.getItem("authToken"));
    expect(token).toBeTruthy();
  });

  // ✅ TEST 4: User can navigate from dashboard sidebar
  test("User can navigate from dashboard sidebar", async ({ page }) => {
    // Pre-login
    await page.goto("/login");
    await page.getByPlaceholder(/Correo|Email/i).fill("admin@crm.com");
    await page.getByPlaceholder(/Contraseña/i).fill("123456");
    await page.getByRole("button", { name: /Entrar|Iniciar/i }).click();
    await page.waitForURL("/dashboard");
    
    // Verificar que estamos en dashboard
    await expect(page.getByText(/Panel de Control General/i)).toBeVisible();
    
    // Verificar que el sidebar tiene los módulos
    await expect(page.getByText(/Resumen/i).first()).toBeVisible();
    await expect(page.getByText(/Inbox Unificado/i)).toBeVisible();
    await expect(page.getByText(/Funnel \/ Pipeline/i)).toBeVisible();
  });

  // ✅ TEST 5: User clicks Inbox
  test("User clicks Inbox", async ({ page }) => {
    // Pre-login
    await page.goto("/login");
    await page.getByPlaceholder(/Correo|Email/i).fill("admin@crm.com");
    await page.getByPlaceholder(/Correo|Email/i).blur(); // Trigger validation
    await page.getByPlaceholder(/Contraseña/i).fill("123456");
    await page.getByRole("button", { name: /Entrar|Iniciar/i }).click();
    await page.waitForURL("/dashboard");
    
    // Esperar a que el sidebar esté visible
    await page.waitForSelector("button:has-text('Inbox Unificado')");
    
    // Click en Inbox Unificado
    const inboxButton = page.getByRole("button", { name: /Inbox Unificado/i });
    await expect(inboxButton).toBeVisible();
    await inboxButton.click();
    
    // El click debe ser detectado (validar que no hay error visual)
    await page.waitForTimeout(500); // Pequeña pausa para animaciones
    
    // Verificar que el click ocurrió (el botón debería tener hover o estar deshabilitado)
    // Nota: Como Inbox aún no tiene página, simplemente verificamos el click
    await expect(inboxButton).toBeVisible();
  });

  // ✅ TEST 6: User clicks Pipeline
  test("User clicks Pipeline", async ({ page }) => {
    // Pre-login
    await page.goto("/login");
    await page.getByPlaceholder(/Correo|Email/i).fill("admin@crm.com");
    await page.getByPlaceholder(/Correo|Email/i).blur();
    await page.getByPlaceholder(/Contraseña/i).fill("123456");
    await page.getByRole("button", { name: /Entrar|Iniciar/i }).click();
    await page.waitForURL("/dashboard");
    
    // Esperar a que el sidebar esté visible
    await page.waitForSelector("button:has-text('Funnel / Pipeline')");
    
    // Click en Pipeline
    const pipelineButton = page.getByRole("button", { name: /Funnel \/ Pipeline/i });
    await expect(pipelineButton).toBeVisible();
    await pipelineButton.click();
    
    // Pequeña pausa para animaciones
    await page.waitForTimeout(500);
    
    // Verificar que el click ocurrió
    await expect(pipelineButton).toBeVisible();
  });

  // ✅ TEST 7: User can logout from dashboard
  test("User can logout from dashboard", async ({ page }) => {
    // Pre-login
    await page.goto("/login");
    await page.getByPlaceholder(/Correo|Email/i).fill("admin@crm.com");
    await page.getByPlaceholder(/Correo|Email/i).blur();
    await page.getByPlaceholder(/Contraseña/i).fill("123456");
    await page.getByRole("button", { name: /Entrar|Iniciar/i }).click();
    await page.waitForURL("/dashboard");
    
    // Buscar botón logout usando texto específico
    const logoutLink = page.locator("a, button").filter({ hasText: /Cerrar Sesión/i });
    await expect(logoutLink).toBeVisible();
    await logoutLink.click();
    
    // Verificar redirección a home
    await page.waitForURL("/", { timeout: 3000 });
    expect(page.url()).not.toContain("/dashboard");
  });

  // ✅ TEST 8: User can navigate to register from login
  test("User navigates from login to register", async ({ page }) => {
    await page.goto("/login");
    
    // Buscar link de registro
    const registerLink = page.getByRole("button", { name: /Regístrate aquí/i });
    await expect(registerLink).toBeVisible();
    await registerLink.click();
    
    // Verificar redirección a /register
    await page.waitForURL("/register");
    expect(page.url()).toContain("/register");
    
    // Verificar elementos de la página register
    await expect(page.getByText(/Crea tu Cuenta/i)).toBeVisible();
    await expect(page.getByPlaceholder(/Nombre de la Empresa/i)).toBeVisible();
  });

  // ✅ TEST 9: User can register and login
  test("User can register new company", async ({ page }) => {
    await page.goto("/register");
    
    // Llenar formulario de registro
    const timestamp = Date.now();
    const testEmail = `test${timestamp}@example.com`;
    
    await page.getByPlaceholder(/Nombre de la Empresa/i).fill("Test Company Inc");
    await page.getByPlaceholder(/Nombre de la Empresa/i).blur();
    
    await page.getByPlaceholder(/Correo Corporativo/i).fill(testEmail);
    await page.getByPlaceholder(/Correo Corporativo/i).blur();
    
    await page.getByPlaceholder("••••••••").first().fill("TestPass123");
    await page.getByPlaceholder("••••••••").first().blur();
    
    await page.getByPlaceholder("••••••••").last().fill("TestPass123");
    await page.getByPlaceholder("••••••••").last().blur();
    
    // Aceptar términos
    const acceptCheckbox = page.locator('input[type="checkbox"]').first();
    await acceptCheckbox.check();
    
    // Submit
    const registerButton = page.getByRole("button", { name: /Crear Cuenta/i });
    await expect(registerButton).toBeEnabled();
    await registerButton.click();
    
    // Verificar mensaje de éxito
    await expect(page.getByText(/Registro exitoso/i)).toBeVisible({ timeout: 2000 });
    
    // Verificar redirección a dashboard
    await page.waitForURL("/dashboard", { timeout: 5000 });
    expect(page.url()).toContain("/dashboard");
  });

  // ✅ TEST 10: Mobile responsive navigation
  test("Mobile menu navigation works", async ({ browser }) => {
    const context = await browser.newContext({ 
      viewport: { width: 375, height: 667 } // iPhone SE size
    });
    const page = await context.newPage();
    
    await page.goto("/");
    
    // Abrir menú móvil
    const menuButton = page.getByRole("button").filter({ has: page.locator('.material-symbols-outlined') }).first();
    await menuButton.click();
    
    // Verificar que los botones de auth están visibles
    const loginButtonMobile = page.getByRole("button", { name: /Iniciar Sesión/i }).last();
    await expect(loginButtonMobile).toBeVisible();
    
    // Click en login desde menú móvil
    await loginButtonMobile.click();
    await page.waitForURL("/login");
    
    // Verificar que estamos en login
    await expect(page.getByText(/Inicia Sesión/i)).toBeVisible();
    
    await context.close();
  });
});
