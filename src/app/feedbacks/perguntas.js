module.exports = loja => {
  return {
    opening: ` Olá, eu sou o FeedBot, da CouponFeed. Estou aqui para conversar com você sobre sua experiência recente no estabelecimento ${loja}`,
    questions: [
      {
        qid: 'd3c64a66-1685-11ea-8d71-362b9e155667',
        type: 'radio',
        question:
          'O quão satisfeito você está com nosso serviço de atendimento?',
        // (Se sua empresa está buscando melhorar o atendimento pós- venda, essa é uma boa pergunta a se fazer.)
        options: [
          { id: 0, value: 0, color: '#b72125', type: 'detrator', text: ':(' },
          { id: 1, value: 1, color: '#d52027', type: 'detrator', text: ':(' },
          { id: 2, value: 2, color: '#f05223', type: 'detrator', text: ':(' },
          { id: 3, value: 3, color: '#f37022', type: 'detrator', text: ':(' },
          { id: 4, value: 4, color: '#faa823', type: 'detrator', text: ':(' },
          { id: 5, value: 5, color: '#ffca27', type: 'detrator', text: ':(' },
          { id: 6, value: 6, color: '#ecdb12', type: 'detrator', text: ':(' },
          { id: 7, value: 7, color: '#e8e73d', type: 'neutro', text: ':|' },
          { id: 8, value: 8, color: '#c5d82e', type: 'neutro', text: ':|' },
          { id: 9, value: 9, color: '#afd135', type: 'promotor', text: ':)' },
          { id: 10, value: 10, color: '#65b64d', type: 'promotor', text: ':)' },
        ],
      },
      {
        qid: 'd3c64a66-1685-11ea-8d71-362b9e155667',
        question:
          'O quão satisfeito você está com nosso serviço de atendimento?',
        type: 'text',
        // (Se sua empresa está buscando melhorar o atendimento pós- venda, essa é uma boa pergunta a se fazer.)
        options: [
          {
            aid: 'd3c64cc8-1685-11ea-8d71-362b9e155667',
            op: 'Que legal! O que mais você gostou no atendimento?',
          },
          {
            aid: 'd3c64e1c-1685-11ea-8d71-362b9e155667',
            op:
              'O que poderíamos fazer para tornar sua experiência como consumidor ainda melhor?',
          },
          {
            aid: 'd3c64f5c-1685-11ea-8d71-362b9e155667',
            op: 'O que você acha que faltou hoje no atendimento a você ?',
          },
        ],
      },
    ],
  };
};
