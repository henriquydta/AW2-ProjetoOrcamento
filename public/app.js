class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }

        console.log(this)

        if (this.mes == 4 || this.mes == 6 || this.mes == 9 || this.mes == 11) {
            if (this.dia > 30) {
                return false
            }
        }

        console.log("Passou no primeiro teste")

        if (this.mes == 2) {
            if (this.ano % 4 == 0) {
                if (this.dia > 29) {
                    return false
                }
            } else {
                if (this.dia > 28) {
                    return false
                }
            }
        }

        console.log("Passou no segundo teste")

        if (this.dia > 31) {
            return false
        }

        console.log("Passou no terceiro teste")

        this.valor = parseFloat(this.valor)

        if (isNaN(this.valor)) {
            return false
        }

        console.log("Passou no quarto teste")

        return true
    }
}

class Bd {
    somarValoresMes(mes, ano) {
        let despesas = this.recuperarTodosRegistros()
        let total = despesas.reduce((acc, despesa) => {
            if (ano != undefined && ano != '' && ano != null) {
                if (despesa.mes == mes && despesa.ano == ano) {
                    return acc + parseFloat(despesa.valor)
                }
            } else if (despesa.mes == mes) {
                return acc + parseFloat(despesa.valor)
            }
            return acc
        }, 0)
        return total
    }

    somarValoresAno(ano) {
        let despesas = this.recuperarTodosRegistros()
        let total = despesas.reduce((acc, despesa) => {
            if (despesa.ano == ano) {
                return acc + parseFloat(despesa.valor)
            }
            return acc
        }, 0)
        return total
    }

    constructor() {
        let id = localStorage.getItem('id')

        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    gravar(d) {
        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(d))

        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros() {
        let despesas = Array()

        let id = localStorage.getItem('id')

        for (let i = 1; i <= id; i++) {
            let despesa = JSON.parse(localStorage.getItem(i))

            if (despesa === null) {
                continue
            }
            despesa.id = i
            despesas.push(despesa)
        }

        return despesas
    }

    pesquisar(despesa) {
        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosRegistros()
        console.log(despesasFiltradas);
        console.log(despesa)

        if (despesa.ano != '') {
            console.log("filtro de ano");
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }

        if (despesa.mes != '') {
            console.log("filtro de mes");
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }

        if (despesa.dia != '') {
            console.log("filtro de dia");
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }

        if (despesa.tipo != '') {
            console.log("filtro de tipo");
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }

        if (despesa.descricao != '') {
            console.log("filtro de descricao");
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }

        if (despesa.valor != '') {
            console.log("filtro de valor");
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        return despesasFiltradas
    }

    remover(id) {
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

function cadastrarDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )

    if (despesa.validarDados()) {
        bd.gravar(despesa)

        document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
        document.getElementById('modal_titulo_div').className = 'modal-header text-success'
        document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'
        document.getElementById('modal_btn').innerHTML = 'Voltar'
        document.getElementById('modal_btn').className = 'btn btn-success'

        $('#modalRegistraDespesa').modal('show')

        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
    } else {
        document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro'
        document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
        document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente!'
        document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
        document.getElementById('modal_btn').className = 'btn btn-danger'

        $('#modalRegistraDespesa').modal('show')
    }
}

function carregaListaDespesas(despesas = Array(), filtro = false) {
    if (despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros()
    }

    let listaDespesas = document.getElementById("listaDespesas")
    listaDespesas.innerHTML = ''
    despesas.forEach(function(d) {
        var linha = listaDespesas.insertRow()

        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

        switch (d.tipo) {
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Educação'
                break
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo = 'Saúde'
                break
            case '5': d.tipo = 'Transporte'
                break
        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor.toFixed(2).replace('.', ',')

        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fa fa-times" ></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function() {
            let id = this.id.replace('id_despesa_', '')
            bd.remover(id)
            window.location.reload()
        }
        linha.insertCell(4).append(btn)
        console.log(d)
    })
}

function pesquisarDespesa() {
    let ano = document.getElementById("ano").value
    let mes = document.getElementById("mes").value
    let dia = document.getElementById("dia").value
    let tipo = document.getElementById("tipo").value
    let descricao = document.getElementById("descricao").value
    let valor = document.getElementById("valor").value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)

    this.carregaListaDespesas(despesas, true)
}

function somarValoresDoMes() {
    document.getElementById("resultadoAno").innerHTML = ''

    let mes = document.getElementById("mes").value
    console.log(`Somar valores para o mês: ${mes}`)
    let total = bd.somarValoresMes(mes)
    console.log(`Total de despesas no mês: R$ ${total.toFixed(2)}`)
    document.getElementById("resultadoMes").innerHTML = `Total de despesas no mês: R$ ${total.toFixed(2)}`
}

function somarValoresDoAno() {
    document.getElementById("resultadoMes").innerHTML = ''

    let ano = document.getElementById("ano").value
    console.log(`Somar valores para o ano: ${ano}`)
    let total = bd.somarValoresAno(ano)
    console.log(`Total de despesas no mês: R$ ${total.toFixed(2)}`)
    document.getElementById("resultadoAno").innerHTML = `Total de despesas no ano: R$ ${total.toFixed(2)}`
}

function exportarDespesasParaPlanilha() {
  const bd = new Bd()
  const despesas = bd.recuperarTodosRegistros()

  despesas.forEach(d => {
    const body = new URLSearchParams({
      ano: d.ano,
      mes: d.mes,
      dia: d.dia,
      tipo: d.tipo,
      descricao: d.descricao,
      valor: d.valor
    })

    fetch('/spreadsheet', {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: body.toString()
    })
      .then(res => res.text())
      .then(resposta => console.log("Resposta:", resposta))
      .catch(err => console.error("Erro:", err))
  })
}
