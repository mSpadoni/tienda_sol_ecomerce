describe('paginado', () => {
  it('pagina', () => {
    cy.visit('http://localhost:3000')
    
    // Esperar a que el carrusel cargue
    cy.get(".carousel-track").should('be.visible');
    const carrusel = cy.get(".carousel-wrapper .carousel-viewport .carousel-track");
    carrusel.children().should('have.length', 10);
    
    // Ir a página 2
    const botonPagina2 = cy.get(".paginacion > button:nth-child(2)");
    botonPagina2.click();

    // Esperar a que la página 2 cargue: obtener el primer hijo del carrusel-track
    // y luego buscar cualquier elemento que contenga el nombre del producto
    const productoItem = cy.get(".carousel-track").children().first()
    productoItem.should('be.visible')
      .then(($firstProduct) => {
        const productName = $firstProduct.text();
        expect(productName).to.include("Auriculares");
      });
    
    
  })
})