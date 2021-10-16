/**
 * Component which holds a set of data
 */
interface IComponent {
}

interface IUpdate {
    Update(dt : unknown) : void
}
interface IUpdateEntity {
    Update(dt : Set<Entity>) : void
}

interface IAwake {
    Awake(time : number) : void
}

type constr<T> = new(...args: unknown[]) => T// <--- ADD

/**
 * Contains a set of components, usually associated to an Entity
 */
class ComponentContainer{
    // protected _components: Set<IComponent> = new Set()
    protected _components: Map<Function, IComponent> = new Map()

    constructor(...components : IComponent[]){
        for(const component of components){
            this._components.set(component.constructor, component)
        }
        // this._components = new Set(components)
    }

    public get components(){
        return this._components //not a copy
    }

    public AddComponent(...components : IComponent[]) : void {
        for(const component of components){
            //this._components.add(component)
            this._components.set(component.constructor, component)
        }
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
        return this._components.delete(constr)
        /*
        for( let i = 0; i < this._components.length; i++){
            const component = this._components[i]
            if(component instanceof constr){
                index = i
                break
            }
        }

        if(index != null){
            this._components.splice(index, 1)
            return true
        }
        return false*/
    }

    public HasComponent<C extends IComponent>(component: constr<C>) : boolean{
        return this._components.has(component)
        /*
        for(const component of this._components){
            if(component instanceof constr){
                return true
            }
        }
        return false*/
    }

    public HasAllComponents<C extends IComponent>(components: Iterable<constr<C>>){
        for(const component of components){
            if(!this._components.has(component)) return false
        }
        return true
    }

    public HasAnyComponents<C extends IComponent>(components: Iterable<constr<C>>){
        // note each component is a constructor
        for(const component of components){
            if (this._components.has(component)) return true
        }
    }
}

/**
 * Entity is a pointer to the set of components -> ComponentContainer
 */
type Entity = number

abstract class System implements IUpdate{
    public ecs!: ECS
    public abstract requireComponents : Set<constr<IComponent>>;
    public abstract Update(entities: Set<Entity>) : void
}

class ECS implements IUpdate{
    protected entities : Map<Entity, ComponentContainer> = new Map<Entity, ComponentContainer>()
    protected systems : Map<System, Set<Entity>> = new Map<System, Set<Entity>>()

    private nextId : number = 0
    private entitiesToRemove : Set<Entity> = new Set<Entity>()

    public AddEntity(): Entity{
        const entity = this.nextId
        this.nextId ++
        this.entities.set(entity, new ComponentContainer())
        return entity
    }

    public RemoveEntity(entity : Entity) : void{
        this.entitiesToRemove.add(entity)
    }

    public ClearGarbageEntities(){
        for (const entity of this.entitiesToRemove){
            this.DestroyEntity(entity)
            this.entitiesToRemove.delete(entity)
        }
    }

    private DestroyEntity(entity : Entity) : void{
        this.entities.delete(entity)
        for (const entities of this.systems.values()){
            entities.delete(entity)
        }
    }

    public AddComponent(entity : Entity, ...components : IComponent[]){
        const r = this.entities.get(entity)?.AddComponent(...components)
        this.CheckEntity(entity)
        return r
    }

    public RemoveComponent<C extends IComponent>(entity : Entity, component : constr<C>){
        const r = this.entities.get(entity)?.RemoveComponent(component)
        this.CheckEntity(entity)
        return r
    }

    public AddSystem(system : System){
        // check if system is empty
        if (system.requireComponents.size == 0){
            console.warn(`System not added: Empty component list ${system}`)
            return
        }

        system.ecs = this

        this.systems.set(system, new Set())
        for(const entity of this.entities.keys()){
            this.CheckEntitySystem(entity, system)
        }
    }

    public RemoveSystem(system: System): void {
        this.systems.delete(system);
    }

    /**
     * Updates the systems
     */
    public Update(dt : number = 0){
        for (const [system, entities] of this.systems.entries()){
            system.Update(entities)
        }
    }

    /**
     * Checks if the entity satisfies the system requirements 
     * @param entity 
     * @param system 
     * @returns 
     */
    private CheckEntitySystem(entity : Entity, system : System){
        const container = this.entities.get(entity)
        const requireComponents = system.requireComponents
        if (container?.HasAllComponents(requireComponents)){
            this.systems.get(system)?.add(entity)
        }
        else{
            this.systems.get(system)?.delete(entity)
        }
        return
    }

    /**
     * Checks if the entity satisfies any system requirements
     * @param entity 
     */
    private CheckEntity(entity : Entity){
        for (const system of this.systems.keys()){
            this.CheckEntitySystem(entity, system)
        }
    }
}

export {IComponent, Entity}