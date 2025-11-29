import React from "react";
import {
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Button,
    Grid,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useCarrito } from "../provieder/carritoProvider.jsx";
import { useCurrency } from "../provieder/CurrencyProvider.jsx";
import { CURRENCIES } from "../provieder/currencies.js";
import "./productList.css";

// eslint-disable-next-line react/prop-types
const ProductList = ({ products = [], onAddToCart }) => {
    const { currency } = useCurrency();
    const carrito = useCarrito();

    const formatPrice = (amount) =>
        `${CURRENCIES[currency].symbol}${amount.toLocaleString(
            CURRENCIES[currency].locale,
        )}`;

    const handleAdd = (product) => {
        if (onAddToCart) return onAddToCart(product);
        if (carrito?.addItem) return carrito.addItem(product);
        if (carrito?.agregarProducto) return carrito.agregarProducto(product);
        console.warn("No handler definido para agregar al carrito");
    };

    return (

        <Grid container spacing={2} className="product-list-grid">
            {products.map((p) => {
                const prod = p.producto || p;
                return (
                    <Grid item xs={12} sm={6} md={4} key={prod._id || prod.id}>
                        <Card className="product-card">
                            {prod.imagen && (
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={prod.imagen}
                                    alt={prod.titulo}
                                />
                            )}
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {prod.titulo}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {formatPrice(prod.precio ?? 0)}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() => handleAdd(prod)}
                                >
                                    Agregar
                                </Button>
                                <Button size="small" component={Link} to={`/productos/${prod._id || prod.id}`}>
                                    Ver
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default ProductList;