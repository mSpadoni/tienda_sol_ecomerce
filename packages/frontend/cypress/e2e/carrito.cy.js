describe('carrito', () => {
  it('Se agregan productos correctamente.', () => {
    cy.visit('http://localhost:3000')
    

    const inputUsuario = cy.get(".navbar-right .auth-wrapper").click();

    const botonIniciarSesion = cy.get("li").contains('Ingresá').click();

    cy.origin('http://localhost:8080', () => {
        const inputUsuario = cy.contains('label', 'Usuario')
            .parent()          
            .find('input')
            .type('Test');
        const inputContrasenia = cy.contains('label', 'Contraseña')
            .parent()
            .find('input')
            .type('Contrasen1@');
        const botonIniciarSesion = cy.get(".buttons input").click();
    })
    
    const verDetallesproductoItem = cy.get(".products-grid > article:nth-child(1) .product-card-actions a");

    verDetallesproductoItem.click();

    cy.origin('http://localhost:8080', () => {
        const botonIniciarSesion = cy.get(".buttons a").click();
    })     
    
    const verDetallesproductoItem2 = cy.get(".products-grid > article:nth-child(2) .product-card-actions a", { timeout: 10000 }).should('be.visible');
    
    cy.wait(2000);
    
    verDetallesproductoItem2.click();

    const botonMas = cy.get("button").contains("+").click();

    const botonAgregarAlCarrito = cy.get("button").contains("Agregar al carrito").click();
  })
})