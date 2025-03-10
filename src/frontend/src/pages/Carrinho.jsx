import styled from "styled-components";
import CarrinhoComponente from "../components/CarrinhoComponente";
import React, { useEffect } from "react";

const Carrinho = () => {
    const [produtos, setProdutos] = React.useState([]);

    useEffect(() => {
        const cartProducts = JSON.parse(localStorage.getItem('cartProducts') || '[]');
        // Agrega os IDs e conta ocorrência
        const productCounts = {};
        cartProducts.forEach(id => {
            productCounts[id] = (productCounts[id] || 0) + 1;
        });
        const uniqueIds = Object.keys(productCounts);
        Promise.all(
            uniqueIds.map(id =>
                fetch(`https://v10k527pp4.execute-api.us-east-1.amazonaws.com/stickers/${id}`)
                    .then(response => response.json())
                    .then(data => ({ ...data, quantidade: productCounts[id] }))
            )
        ).then(productsWithQuantity => {
            setProdutos(productsWithQuantity);
        });
    }, []);

    return (
        <Container>
            <CarrinhoContainer>
                <h1>Carrinho</h1>
                <div className="indice-carrinho">
                    <h2>Produto</h2>
                    <h2>Quantidade</h2>
                    <h2>Preço</h2>
                </div>
                {produtos.map((produto, index) => (
                    <React.Fragment key={index}>
                        <CarrinhoComponente produto={produto} />
                        <div className="divisor"></div>
                    </React.Fragment>
                ))}
            </CarrinhoContainer>
            <div className="carrinho-resumo">
                {/* Adicione o conteúdo do resumo do carrinho aqui */}
            </div>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 5dvh 7.5dvw;

    .carrinho-resumo {
        display: flex;
        flex-direction: column;
        background-color: white;
        width: 20dvw;
        border-radius: 10px;
        padding: 20px;
        height: 45dvh;
        box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
    }
`;

const CarrinhoContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 54dvw;
    background-color: white;
    border-radius: 10px;
    min-height: 70dvh;
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
    padding: 0 2dvw;

    h1 {
        margin-top: 4dvh;
        width: 95%;
        font-size: 18px;
        font-weight: 500;
    }

    .indice-carrinho {
        width: 95%;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #e0e0e0;

        h2 {
            margin: 0;
            font-size: 13px;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 5px 0;
            color: #888888;
        }
    }

    .divisor {
        width: 95%;
        border-bottom: 1px solid #e0e0e0;   
    }
`;

export default Carrinho;