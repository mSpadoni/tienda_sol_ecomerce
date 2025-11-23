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
    
    const verDetallesproductoItem2 = cy.get(".products-grid > article:nth-child(2) .product-card-actions a", { timeout: 10000 }).should('be.visible');
    
    cy.wait(500);
    
    verDetallesproductoItem2.click();

    const botonMas = cy.get("button").contains("+").click();

    const botonAgregarAlCarrito = cy.get("button").contains("Agregar al carrito").click();

    cy.get('.navbar-right span button').click();

    cy.get('div').contains('Comprar').should('be.visible').click();


    //rellenar el formulario de entrega
    cy.get('.form-grid').find('div').contains('label','Calle').parent().find('input').type('Brandsen');
    cy.get('.form-grid').find('div').contains('label','Altura').parent().find('input').type('805');
    cy.get('.form-grid').find('div').contains('label','Piso').parent().find('input').type('3');
    cy.get('.form-grid').find('div').contains('label','Departamento').parent().find('input').type('norte');
    cy.get('.form-grid').find('div').contains('label','CodigoPostal').parent().find('input').type('1417');
    cy.get('.form-grid').find('div').contains('label','Ciudad').parent().find('input').type('CABA');
    cy.get('.form-grid').find('div').contains('label','Provincia').parent().find('input').type('CABA');
    cy.get('.form-grid').find('div').contains('label','Pais').parent().find('input').type('Argentina');


    cy.get('button').contains('Comprar').click();

    cy.get('.navbar-center').find('.nav-link').contains('Mis pedidos').click();

    cy.get('.lista-pedidos-container').find('.pedido-detalles').contains('Strong','Dirección:').parent().contains('Brandsen, 805 3 Piso 3 norte, CABA').should('be.visible');
    cy.get('.lista-pedidos-container').find('.pedido-detalles').contains('Strong','Estado:').parent().contains('confirmado').should('be.visible');

    const hoy = new Date().toISOString().split('T')[0];
    
  const [anio, mes, dia] = hoy.split('-');

    const fechaInvertida = `${dia}-${mes}-${anio}`;

    cy.get('.lista-pedidos-container').find('.pedido-detalles').contains('Strong','Fecha:').parent().contains(fechaInvertida.replace(/-/g, '/')).should('be.visible');
  })
})