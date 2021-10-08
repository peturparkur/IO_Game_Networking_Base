interface IComponent extends IUpdate, IAwake{
    entity : Entity | null
}

interface IUpdate {
    Update(dt : number) : void
}

interface IAwake {
    Awake(time : number) : void
}

type constr<T> = { new(...args: unknown[]): T } // <--- ADD

// we can consider later if we want to have children entities
abstract class Entity implements IUpdate, IAwake{
    protected _components: IComponent[] = []

    constructor(...components : IComponent[]){
        this._components = components.slice()
    }
    Awake(time: number = 0): void {
        for (const component of this._components){
            component.Update(time)
        }
    }
    Update(dt: number): void {
        for(const component of this._components){
            component.Update(dt)
        }
    }

    public get components() : IComponent[]{
        return this._components //not a copy
    }

    public AddComponent(...components : IComponent[]) : number {
        return this._components.push(...components)
        //for (const component of components){
        //    this._components.push(component)
        //}
        //return this._components.length
    }

    public GetComponent<C extends IComponent>(constr: constr<C>) : C{
        for(const component of this._components){
            if(component instanceof constr){
                return component as C
            }
        }
        throw new Error(`Component ${constr.name} not found on Entity`)
    }

    public RemoveComponent<C extends IComponent>(constr: constr<C>) : boolean{
        let index = null
        for( let i = 0; i < this._components.length; i++){
            const component = this._components[i]
            if(component instanceof constr){
                index = i
                break
            }
        }

        if(index != null){
            this._components[index].entity = null
            this._components.splice(index, 1)
            return true
        }
        return false
    }

    public HasComponent<C extends IComponent>(constr: constr<C>) : boolean{
        for(const component of this._components){
            if(component instanceof constr){
                return true
            }
        }
        return false
    }
}

export {IComponent, Entity}