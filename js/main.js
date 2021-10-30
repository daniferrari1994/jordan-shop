
/* ---- VARIABLES ---- */

const cards = document.getElementById('cards');
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}


/* ---- EVENTOS ---- */


document.addEventListener('DOMContentLoaded', () => {
   fetchData()
   if(localStorage.getItem('carrito')) {
      carrito = JSON.parse(localStorage.getItem('carrito'))
      llenarCarrito();
  }
});

cards.addEventListener('click', e => {
   addCarrito(e);
});

items.addEventListener('click', e => {
   btnAccion(e)
});


/* ---- FUNCIONES Y CONDICIONALES ---- */


const fetchData = async () => {
   try{
      const res = await fetch('productos.json');
      const data = await res.json();
      llenarCards(data);
   } catch (error){
      console.log(error);
   };
};

const llenarCards = data =>{
   data.forEach(producto => {
      console.log(producto);
      templateCard.querySelector('h5').textContent = producto.name
      templateCard.querySelector('p').textContent = producto.price
      templateCard.querySelector('img').setAttribute("src", producto.image);
      templateCard.querySelector('.btn-dark').dataset.id = producto.id

      const clone = templateCard.cloneNode(true);
      fragment.appendChild(clone);
      
   });
   cards.appendChild(fragment);
};

const addCarrito = e => {
   if(e.target.classList.contains('btn-dark')){
       setCarrito(e.target.parentElement);
   }
   e.stopPropagation()
}

const setCarrito = objeto => {
   const product ={
       id: objeto.querySelector('.btn-dark').dataset.id,
       name: objeto.querySelector('h5').textContent,
       price: objeto.querySelector('p').textContent,
       cantidad: 1
   }

   if(carrito.hasOwnProperty(product.id)){
       // Aumentamos SOLO la cantidad del producto, si el mismo ya existe en el carrito
       product.cantidad = carrito[product.id].cantidad + 1
   }

   carrito[product.id] = {...product}
   llenarCarrito()

}

$('#enviar').click(function(){
   $('#bienvenida').slideUp(1000);
})

$('#enviar').click(function(){
   const nombre = $('#nombre').val();
   const apellido = $('#apellido').val();
   $('#feedback').text("Hola " + nombre + " " + apellido);

   const myJSON = {nombre , apellido};
   const myString = JSON.stringify(myJSON);
   localStorage.setItem("myJSON", myString);
});
localStorage.getItem('myJSON');

const llenarCarrito = () => {
   //console.log(carrito)
   items.innerHTML = ''
   Object.values(carrito).forEach(producto =>{
       templateCarrito.querySelector('th').textContent = producto.id
       templateCarrito.querySelectorAll('td')[0].textContent = producto.name
       templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
       templateCarrito.querySelector('.btn-info').dataset.id = producto.id
       templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
       templateCarrito.querySelector('span').textContent = producto.cantidad * producto.price

       const clone = templateCarrito.cloneNode(true)
       fragment.appendChild(clone)
   })
   items.appendChild(fragment)

   llenarFooter()

   localStorage.setItem('carrito', JSON.stringify(carrito))
}

const llenarFooter = () => {
   footer.innerHTML = ''
   if(Object.keys(carrito).length === 0){
       footer.innerHTML = `<th scope="row" colspan="5">Carrito vacio - comienza a comprar!</th>`

       return
   }

   const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad,0)
   const nPrice = Object.values(carrito).reduce((acc, {cantidad, price}) => acc + cantidad * price,0)

   templateFooter.querySelectorAll('td')[0].textContent = nCantidad
   templateFooter.querySelector('span').textContent = nPrice

   const clone = templateFooter.cloneNode(true)
   fragment.appendChild(clone)
   footer.appendChild(fragment)

   const btnVaciar = document.getElementById('vaciar-carrito')
   btnVaciar.addEventListener('click', () =>{
       carrito = {}
       llenarCarrito()
   })

   const btnComprar = document.getElementById('realizar-compra')
   btnComprar.addEventListener('click', () =>{
      carrito = {}
      llenarCarrito()
   })
}

const btnAccion = e => {
   // AUMENTO Y DISMINUCION DE PRODUCTOS
   if(e.target.classList.contains('btn-info')){
       const producto = carrito[e.target.dataset.id]
       producto.cantidad++
       carrito[e.target.dataset.id] = {...producto}
       llenarCarrito()
   }

   if(e.target.classList.contains('btn-danger')){
       const producto = carrito[e.target.dataset.id]
       producto.cantidad--
       if(producto.cantidad === 0){
           delete carrito[e.target.dataset.id]
       }
       llenarCarrito()
   }

   e.stopPropagation()
}