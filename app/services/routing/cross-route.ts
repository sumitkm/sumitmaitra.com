export class CrossRoute
{
  public route: string;
  public name: string;
  public title: string;
  public controller: ApiController;

  constructor(route: string, name: string, title: string, controller: ApiController)
  {
      this.route = route;
      this.name = name;
      this.title = title;
      this.controller = controller;
  }
}
