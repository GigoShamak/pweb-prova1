// CONTROLLER (SSR) de Categoria — traduz HTTP <-> views (res.render + PRG).
// NÃO coloque regra de negócio aqui (isso é do service).
//
// Ações:
//   - index (GET /categorias)      -> renderiza a listagem;
//   - nova  (GET /categorias/nova) -> renderiza o formulário vazio;
//   - criar (POST /categorias)     -> cria e redireciona; se der erro de negócio
//                                     (4xx), reexiba o formulário com a mensagem.
export class CategoriasController {
  constructor(categoriasService) {
    this.service = categoriasService;
    this.index = this.index.bind(this);
    this.nova = this.nova.bind(this);
    this.criar = this.criar.bind(this);
  }

  async index(req, res, next) {
    try {
      res.render('categorias/index', { titulo: 'Categorias', categorias: await this.service.listar() });
    } catch (err) { next(err); }
  }

  nova(req, res) {
    res.render('categorias/form', { titulo: 'Nova Categoria', valores: {}, erros: [] });
  }

  async criar(req, res, next) {
    try {
      await this.service.criar(req.body);
      req.flash('sucesso', 'Categoria criada com sucesso.');
      res.redirect('/categorias');
    } catch (err) {
      if (err.status && err.status < 500) {
        return res.status(err.status).render('categorias/form', { titulo: 'Nova Categoria', valores: req.body, erros: [err.message] });
      }
      next(err);
    }
  }
}