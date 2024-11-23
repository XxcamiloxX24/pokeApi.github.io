const tipoColores = {
    electric: "yellow",
    fire: "orangered",
    water: "lightblue",
    grass: "lightgreen",
    psychic: "violet",
    rock: "saddlebrown",
    ground: "burlywood",
    ice: "lightcyan",
    flying: "skyblue",
    bug: "greenyellow",
    normal: "lightgray",
    poison: "plum",
    ghost: "darkslateblue",
    dragon: "lightcoral",
    fairy: "pink",
    fighting: "lightcoral",
    steel: "silver",
    dark: "gray"
};

const tipoColoresLetra = {
    electric: "black",
    fire: "black",
    water: "black",
    grass: "black",
    psychic: "black",
    ground: "black",
    ice: "black",
    flying: "black",
    bug: "black",
    normal: "black",
    poison: "black",
    ghost: "white",
    dragon: "black",
    fairy: "black",
    fighting: "black",
    steel: "black",
    dark: "white"
};
// Funcion para mostrar la informacion de un objeto
async function escribir(element){

    const tipoPrincipal = element.types[0].type.name;
    const colorLetra = tipoColoresLetra[tipoPrincipal] || "white";
    const colorFondo = tipoColores[tipoPrincipal] || "white";
    const descripcion = await verDescripcion(element.id);

    document.getElementById('contenedoresPoke').innerHTML += 
                `<div class="pokemon" id="mostrar">
                    <div class="card" style="width: 100%; background-color: ${colorFondo}; color:${colorLetra}; font-weight: bold;" id="cartaPokemon">
                        <div class="imagenTam">
                            <img src="${element.sprites.other.home.front_default}" class="card-img-top" alt="ImagenPokemon">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title" id="nombre" style="color:${colorLetra};">${element.name}</h5>
                            <div id="descrip">
                                ${descripcion}
                            </div>
                            <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="verDetalles(${element.id})" id="habilidades">
                            Información
                            </button>
                        </div>
                    </div>
                </div>`;
                
            
                
}
async function verDescripcion(pokemon){
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}/`);
        const data = await res.json();
        const descripcion = data.flavor_text_entries.find(entry => entry.language.name === 'es');
        const descripcionEn = data.flavor_text_entries.find(entry => entry.language.name === 'en');
        return descripcion ? descripcion.flavor_text.replace(/\n|\f/g, ' ') : descripcionEn.flavor_text.replace(/\n|\f/g, ' ');
    } catch (error) {
        console.error("Error al obtener la descripción:", error);
        return 'Descripción no disponible';
    }
            
}
async function verDetalles(id) {
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await res.json();

        // Obtener las habilidades
        console.log(data)
        const habilidades = data.abilities.map(ability => `<li>${ability.ability.name}</li>`).join('');
        const movimientos = data.moves.slice(0,5).map(moves => `<li>${moves.name}</li>`)
        


        const [alturaModificada, pesoModificado] = modificadores(data.height, data.weight);
        let hp;
        let ataq;
        let def;
        let speeed;
        let sp_ataq;
        let sp_def;
        data.stats.forEach(element => {
            if (element.stat.name === "hp") {
                hp = element.base_stat
            } else if(element.stat.name === "attack"){
                ataq = element.base_stat
            } else if(element.stat.name === "defense"){
                def = element.base_stat
            } else if(element.stat.name === "speed"){
                speeed = element.base_stat
            } else if(element.stat.name === "special-attack"){
                sp_ataq = element.base_stat
            } else if(element.stat.name === "special-defense"){
                sp_def = element.base_stat
            }
        });
        
        let imagenOrGif;
        if (data.sprites.other.showdown.front_default == "null"){
            imagenOrGif = data.sprites.front_default
        } else {
            imagenOrGif = data.sprites.other.showdown.front_default
        }
        
        document.getElementById("cuerpoDetailsss").innerHTML = 
            `<div id="detailsss">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">Pokemón#00${data.id}</li>
                    <li class="list-group-item">Peso: ${pesoModificado} Kg</li>
                    <li class="list-group-item">Altura: ${alturaModificada} m</li>
                    <li class="list-group-item">Experiencia: ${data.base_experience}</li>
                    <li class="list-group-item">Habilidades:</li>
                    <ul>${habilidades}</ul>
                    
                </ul>
                <br><br>
                <div id="estadisticas">
                    <div id="conImg">
                        <img src="${imagenOrGif}" alt="ImagenPokemon">
                    </div>
                    <div id="stats">
                        <div id="hpp">
                            <h6 style="background-color: rgb(3, 221, 3); color:black;">HP</h6>
                            <b>${hp}</b>
                        </div>
                        <div id="ataque">
                            <h6 style="background-color: rgb(255, 196, 0); color:black;">Ataq.</h6>
                            <b>${ataq}</b>
                        </div>
                        <div id="defensa">
                            <h6 style="background-color: rgb(255, 72, 0); color:black;">Def.</h6>
                            <b>${def}</b>
                        </div>
                        <div id="velocidad">
                            <h6 style="background-color: rgb(255, 0, 255); color:black;">Speed</h6>
                            <b>${speeed}</b>
                        </div>
                        <div id="ataque_special">
                            <h6 style="background-color: rgb(0, 204, 255); color:black;">Sp. ata.</h6>
                            <b>${sp_ataq}</b>
                        </div>
                        <div id="defensa_special">
                            <h6 style="background-color: rgb(0, 60, 255); color:black;">Sp. def</h6>
                            <b>${sp_def}</b>
                        </div>

                    </div>
            </div>`;
            document.getElementById('exampleModalLabel').innerText = data.name
    } catch (error) {
        console.log("Error al obtener detalles:", error);
    }
}

// función para un número aleatorio
function numeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Funcion para modificar el peso y la altura
function modificadores(p1, p2){
    let height = p1;
    let weight = p2;

    let alturaModificada = 
    height < 10 
    ? `0,${height}` 
    : `${height.toString().slice(0,1)},${height.toString().slice(1)}`

    let pesoModificado;
    if(weight < 100){
        pesoModificado = `${weight.toString().slice(0,1)},${weight.toString().slice(1)}`
    } else if(weight > 100 && weight < 1000){
        pesoModificado = `${weight.toString().slice(0,2)},${weight.toString().slice(2)}`
    } else {
        pesoModificado = `${weight.toString().slice(0,3)},${weight.toString().slice(3)}`
    }
    
    
    return [alturaModificada, pesoModificado]
}


// Realizar Busqueda
let btnBuscar = document.getElementById("btnBuscar")
btnBuscar.addEventListener('click', () =>{
    let pokemon = document.getElementById("busqueda").value
    fetchData(pokemon)
})


//Eliminar la informacion del input al presionar cerrar
document.querySelectorAll(".btn-close").forEach(element => {
    element.addEventListener('click', () => {
        document.getElementById("busqueda").value = "";
    });
});

const fetchData = async (pokemon) => {
    try{
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
        const data = await res.json()
        if(res.ok){
            const descripcion = await verDescripcion(data.id);
    
            let imagenOrGif;
            if ((data.sprites.other.showdown.front_default) == "null"){
                imagenOrGif = data.sprites.front_default
            } else {
                imagenOrGif = data.sprites.other.showdown.front_default
            }
            
            document.getElementById("imagen").src = data.sprites.other.home.front_default
            document.getElementById("nombre").innerText = data.name
            document.getElementById("description").innerText = descripcion
    
            
    
    
            const [alturaModificada, pesoModificado] = modificadores(data.height, data.weight);
            const habilidades = data.abilities.map(ability => `<li>${ability.ability.name}</li>`)
            .join('');
    
            document.getElementById('exampleModalToggleLabel2').innerText = data.name
            let hp;
            let ataq;
            let def;
            let speeed;
            let sp_ataq;
            let sp_def;
            data.stats.forEach(element => {
                if (element.stat.name === "hp") {
                    hp = element.base_stat
                } else if(element.stat.name === "attack"){
                    ataq = element.base_stat
                } else if(element.stat.name === "defense"){
                    def = element.base_stat
                } else if(element.stat.name === "speed"){
                    speeed = element.base_stat
                } else if(element.stat.name === "special-attack"){
                    sp_ataq = element.base_stat
                } else if(element.stat.name === "special-defense"){
                    sp_def = element.base_stat
                }
            });
            
            document.getElementById("cuerpoDetails").innerHTML = 
            `<div id="details">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">Pokemón#00${data.id}</li>
                    <li class="list-group-item">Peso: ${pesoModificado}Kg</li>
                    <li class="list-group-item">Altura: ${alturaModificada} m</li>
                    <li class="list-group-item">Experiencia: ${data.base_experience}</li>
                    <li class="list-group-item">Habilidades:</li>
                        <ul>${habilidades}</ul>
                </ul>
                <br><br>
                    <div id="estadisticas">
                        <div id="conImg">
                            <img src="${imagenOrGif}" alt="ImagenPokemon">
                        </div>
                        <div id="stats">
                            <div id="hpp">
                                <h6 style="background-color: rgb(3, 221, 3); color:black;">HP</h6>
                                <b>${hp}</b>
                            </div>
                            <div id="ataque">
                                <h6 style="background-color: rgb(255, 196, 0); color:black;">Ataq.</h6>
                                <b>${ataq}</b>
                            </div>
                            <div id="defensa">
                                <h6 style="background-color: rgb(255, 72, 0); color:black;">Def.</h6>
                                <b>${def}</b>
                            </div>
                            <div id="velocidad">
                                <h6 style="background-color: rgb(255, 0, 255); color:black;">Speed</h6>
                                <b>${speeed}</b>
                            </div>
                            <div id="ataque_special">
                                <h6 style="background-color: rgb(0, 204, 255); color:black;">Sp. ata.</h6>
                                <b>${sp_ataq}</b>
                            </div>
                            <div id="defensa_special">
                                <h6 style="background-color: rgb(0, 60, 255); color:black;">Sp. def</h6>
                                <b>${sp_def}</b>
                            </div>
    
                        </div>
            </div>`
        } else {
            console.log("no funciona")
        }
        

    } catch (error){
        console.log("Error: ", error)
    }
}

// Mostrar los pokemones con un limite
try{
    let num = numeroAleatorio(0, 1010)
    fetch(`https://pokeapi.co/api/v2/pokemon/?limit=20&offset=${num}`)
        .then(res => res.json())
        .then(json => {
            
            json.results.forEach(element => {
                fetch(`https://pokeapi.co/api/v2/pokemon/${element.name}`).then(res => res.json()).then(json => {
                    escribir(json)
                    
                })
            });

        })
}catch(error){
    alert(error)
}


