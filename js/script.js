

let modalKey = 0;
let quantHamburguer = 1;
let cart = [];

const seleciona = (elemento) => document.querySelector(elemento);
const selecionaTodos = (elemento) => document.querySelectorAll(elemento);

const formatoReal = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const formatoMonetario = (valor) => {
    if(valor) {
        return valor.toFixed(2)
    }
}

const abrirModal = () => {
    seleciona('.hamburguerWindowArea').style.opacity = 0
    seleciona('.hamburguerWindowArea').style.display = 'flex'
        seleciona('.hamburguerWindowArea').style.opacity = 1
    
}

const fecharModal = () => {
    seleciona('.hamburguerWindowArea').style.opacity = 0
        seleciona('.hamburguerWindowArea').style.display = 'none'

}
const botoesFechar = () => {
    // BOTOES FECHAR MODAL
    selecionaTodos('.hamburguer-info-cancelButton, .hamburguerInfo--cancelmobilebutton').forEach((item) => {
        item.addEventListener('click', fecharModal)
    })
}

const preencheDadosDosLanches = (hamburguerItem, item, index) => {
    hamburguerItem.setAttribute('data-key', index);
    hamburguerItem.querySelector('.hamburguer-item--img img').src = item.img;
    hamburguerItem.querySelector('.hamburguer-item--price').innerHTML = formatoReal(item.price[2]);
    hamburguerItem.querySelector('.hamburguer-item--name').innerHTML = item.name;
    hamburguerItem.querySelector('.hamburguer-item--desc').innerHTML = item.description;
}

const preencheDadosModal = (item) =>{
    seleciona('.hamburguerBig img').src = item.img;
    seleciona('.hamburguer-info h1').innerHTML = item.name;
    seleciona('.hamburguer-info-actualPrice').innerHTML = formatoReal(item.price[2]);
    seleciona('.hamburguer-info-desc').innerHTML = item.description;
}

const pegarKey = (e) => {

    let key = e.target.closest('.hamburguer-item').getAttribute('data-key')
    console.log('Pizza clicada ' + key)
    console.log(hamburguerJson[key])


    quantHamburguer = 1


    modalKey = key

    return key
}

const preencherTamanhos = (key) => {
    // tirar a selecao de tamanho atual e selecionar o tamanho grande
    seleciona('.hamburguer-info-size.selected').classList.remove('selected')

    // selecionar todos os tamanhos
    selecionaTodos('.hamburguer-info-size').forEach((size, sizeIndex) => {
        // selecionar o tamanho grande
        (sizeIndex == 2) ? size.classList.add('selected') : ''
        size.querySelector('span').innerHTML = hamburguerJson[key].sizes[sizeIndex]
    })
}

const escolherTamanhoPreco = (key) => {
    // Ações nos botões de tamanho
    // selecionar todos os tamanhos
    selecionaTodos('.hamburguer-info-size').forEach((size, sizeIndex) => {
        size.addEventListener('click', (e) => {
            // clicou em um item, tirar a selecao dos outros e marca o q vc clicou
            // tirar a selecao de tamanho atual e selecionar o tamanho grande
            seleciona('.hamburguer-info-size.selected').classList.remove('selected')
            // marcar o que vc clicou, ao inves de usar e.target use size, pois ele é nosso item dentro do loop
            size.classList.add('selected')

            // mudar o preço de acordo com o tamanho
            seleciona('.hamburguer-info-actualPrice').innerHTML = formatoReal(hamburguerJson[key].price[sizeIndex])
        })
    })
}

const mudarQuantidade = () => {
    // Ações nos botões + e - da janela modal
    seleciona('.hamburguer-info-qtmais').addEventListener('click', () => {
        quantHamburguer++
        seleciona('.hamburguer-info--qt').innerHTML = quantHamburguer
    })

    seleciona('.hamburguer-info-qtmenos').addEventListener('click', () => {
        if(quantHamburguer > 1) {
            quantHamburguer--
            seleciona('.hamburguer-info--qt').innerHTML = quantHamburguer
        }
    })
}

const adicionarNoCarrinho = () => {
    seleciona('.hamburguer-info-addButton').addEventListener('click', () => {
        console.log('Adicionar no carrinho')

        // pegar dados da janela modal atual
    	// qual pizza? pegue o modalKey para usar pizzaJson[modalKey]
    	console.log("Hamburguer" + modalKey)
    	// tamanho
	    let size = seleciona('.hamburguer-info-size.selected').getAttribute('data-key')
	    console.log("Tamanho " + size)
	    // quantidade
    	console.log("Quant. " + quantHamburguer)
        // preco
        let price = seleciona('.hamburguer-info-actualPrice').innerHTML.replace('R$&nbsp;', '')
    
        // crie um identificador que junte id e tamanho
	    // concatene as duas informacoes separadas por um símbolo, vc escolhe
	    let identificador = hamburguerJson[modalKey].id+'t'+size

        // antes de adicionar verifique se ja tem aquele codigo e tamanho
        // para adicionarmos a quantidade
        let key = cart.findIndex( (item) => item.identificador == identificador )
        console.log(key)

        if(key > -1) {
            // se encontrar aumente a quantidade
            cart[key].qt += quantHamburguer
        } else {
            // adicionar objeto pizza no carrinho
            let hamburguer = {
                identificador,
                id: hamburguerJson[modalKey].id,
                size, // size: size
                qt: quantHamburguer,
                price: parseFloat(price) // price: price
            }
            cart.push(hamburguer)
            console.log(hamburguer)
            console.log('Sub total R$ ' + (hamburguer.qt * hamburguer.price).toFixed(2))
        }

        fecharModal()
        abrirCarrinho()
        atualizarCarrinho()
    })
}
const abrirCarrinho = () => {
    console.log('Qtd de itens no carrinho ' + cart.length)
    if(cart.length > 0) {
        // mostrar o carrinho
	    seleciona('aside').classList.add('show')
        seleciona('header').style.display = 'flex' // mostrar barra superior
    }

    // exibir aside do carrinho no modo mobile
    seleciona('.menu-openner').addEventListener('click', () => {
        if(cart.length > 0) {
            seleciona('aside').classList.add('show')
            seleciona('aside').style.left = '0'
        }
    })
}
const fecharCarrinho = () => {
    // fechar o carrinho com o botão X no modo mobile
    seleciona('.menu-closer').addEventListener('click', () => {
        seleciona('aside').style.left = '100vw' // usando 100vw ele ficara fora da tela
        seleciona('header').style.display = 'flex'
    })
}

const atualizarCarrinho = () => {
    // exibir número de itens no carrinho
	seleciona('.menu-openner span').innerHTML = cart.length
	
	// mostrar ou nao o carrinho
	if(cart.length > 0) {

		// mostrar o carrinho
		seleciona('aside').classList.add('show')

		// zerar meu .cart para nao fazer insercoes duplicadas
		seleciona('.cart').innerHTML = ''

        // crie as variaveis antes do for
		let subtotal = 0
		let desconto = 0
		let total    = 0

        // para preencher os itens do carrinho, calcular subtotal
		for(let i in cart) {
			// use o find para pegar o item por id
			let hamburguerItem = hamburguerJson.find( (item) => item.id == cart[i].id )
			console.log(hamburguerItem)

            // em cada item pegar o subtotal
        	subtotal += cart[i].price * cart[i].qt
            //console.log(cart[i].price)

			// fazer o clone, exibir na telas e depois preencher as informacoes
			let cartItem = seleciona('.models .cart--item').cloneNode(true)
			seleciona('.cart').append(cartItem)

			let hamburguerSizeName = cart[i].size

			let hamburguerName = `${hamburguerItem.name} (${hamburguerSizeName})`

			// preencher as informacoes
			cartItem.querySelector('img').src = hamburguerItem.img
			cartItem.querySelector('.cart--item-nome').innerHTML = hamburguerName
			cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt

			// selecionar botoes + e -
			cartItem.querySelector('.cart-item-qtmais').addEventListener('click', () => {
				console.log('Clicou no botão mais')
				// adicionar apenas a quantidade que esta neste contexto
				cart[i].qt++
				// atualizar a quantidade
				atualizarCarrinho()
			})

			cartItem.querySelector('.cart-item-qtmenos').addEventListener('click', () => {
				console.log('Clicou no botão menos')
				if(cart[i].qt > 1) {
					// subtrair apenas a quantidade que esta neste contexto
					cart[i].qt--
				} else {
					// remover se for zero
					cart.splice(i, 1)
				}

                (cart.length < 1) ? seleciona('header').style.display = 'flex' : ''

				// atualizar a quantidade
				atualizarCarrinho()
			})

			seleciona('.cart').append(cartItem)

		} // fim do for

		// fora do for
		// calcule desconto 10% e total
		//desconto = subtotal * 0.1

        if (subtotal>=40){
            desconto = subtotal*0.1
        }else{
            desconto = subtotal * 0
        }
		    
		total = subtotal - desconto

		// exibir na tela os resultados
		// selecionar o ultimo span do elemento
		seleciona('.subtotal span:last-child').innerHTML = formatoReal(subtotal)
		seleciona('.desconto span:last-child').innerHTML = formatoReal(desconto)
		seleciona('.total span:last-child').innerHTML    = formatoReal(total)

	} else {
		// ocultar o carrinho
		seleciona('aside').classList.remove('show')
		seleciona('aside').style.left = '100vw'
	}
}
const finalizarCompra = () => {
    seleciona('.cart--finalizar').addEventListener('click', () => {
        console.log('Finalizar compra')
        seleciona('aside').classList.remove('show')
        seleciona('aside').style.left = '100vw'
        seleciona('header').style.display = 'flex'

        window.location.assign("entrega.html");
    })
}






hamburguerJson.map((item, index)=>{
    //console.log(item);
    let hamburguerItem = document.querySelector('.models .hamburguer-item').cloneNode(true);
    //console.log(hamburguerItem);


    seleciona('.hamburguer-area').append(hamburguerItem);

    //preenchendo os dados das divs de hamburgueres

    preencheDadosDosLanches(hamburguerItem, item, index);

    //hamburguer selecionado

    hamburguerItem.querySelector('.hamburguer-item a').addEventListener('click', (e) =>{
        e.preventDefault()
        console.log('clicou')

        let chave = pegarKey(e) 

        abrirModal();

        //preenchimento

        preencheDadosModal(item)

        preencherTamanhos(chave)

        seleciona('.hamburguer-info--qt').innerHTML = quantHamburguer

        escolherTamanhoPreco(chave)

    })

    botoesFechar();
})

mudarQuantidade()
adicionarNoCarrinho()
atualizarCarrinho()
fecharCarrinho()
finalizarCompra()