/**
 * Contains a set of components, usually associated to an Entity
 */
class ComponentContainer {
    constructor(...components) {
        // protected _components: Set<IComponent> = new Set()
        this._components = new Map();
        for (const component of components) {
            this._components.set(component.constructor, component);
        }
        // this._components = new Set(components)
    }
    get components() {
        return this._components; //not a copy
    }
    AddComponent(...components) {
        for (const component of components) {
            //this._components.add(component)
            this._components.set(component.constructor, component);
        }
        //for (const component of components){
        //    this._components.push(component)
        //}
        //return this._components.length
    }
    GetComponent(constr) {
        for (const component of this._components) {
            if (component instanceof constr) {
                return component;
            }
        }
        throw new Error(`Component ${constr.name} not found on Entity`);
    }
    RemoveComponent(constr) {
        return this._components.delete(constr);
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
    HasComponent(component) {
        return this._components.has(component);
        /*
        for(const component of this._components){
            if(component instanceof constr){
                return true
            }
        }
        return false*/
    }
    HasAllComponents(components) {
        for (const component of components) {
            if (!this._components.has(component))
                return false;
        }
        return true;
    }
    HasAnyComponents(components) {
        // note each component is a constructor
        for (const component of components) {
            if (this._components.has(component))
                return true;
        }
    }
}
class System {
}
class ECS {
    constructor() {
        this.entities = new Map();
        this.systems = new Map();
        this.nextId = 0;
        this.entitiesToRemove = new Set();
    }
    AddEntity() {
        const entity = this.nextId;
        this.nextId++;
        this.entities.set(entity, new ComponentContainer());
        return entity;
    }
    RemoveEntity(entity) {
        this.entitiesToRemove.add(entity);
    }
    ClearGarbageEntities() {
        for (const entity of this.entitiesToRemove) {
            this.DestroyEntity(entity);
            this.entitiesToRemove.delete(entity);
        }
    }
    DestroyEntity(entity) {
        this.entities.delete(entity);
        for (const entities of this.systems.values()) {
            entities.delete(entity);
        }
    }
    AddComponent(entity, ...components) {
        var _a;
        const r = (_a = this.entities.get(entity)) === null || _a === void 0 ? void 0 : _a.AddComponent(...components);
        this.CheckEntity(entity);
        return r;
    }
    RemoveComponent(entity, component) {
        var _a;
        const r = (_a = this.entities.get(entity)) === null || _a === void 0 ? void 0 : _a.RemoveComponent(component);
        this.CheckEntity(entity);
        return r;
    }
    AddSystem(system) {
        // check if system is empty
        if (system.requireComponents.size == 0) {
            console.warn(`System not added: Empty component list ${system}`);
            return;
        }
        system.ecs = this;
        this.systems.set(system, new Set());
        for (const entity of this.entities.keys()) {
            this.CheckEntitySystem(entity, system);
        }
    }
    RemoveSystem(system) {
        this.systems.delete(system);
    }
    /**
     * Updates the systems
     */
    Update(dt = 0) {
        for (const [system, entities] of this.systems.entries()) {
            system.Update(entities);
        }
    }
    /**
     * Checks if the entity satisfies the system requirements
     * @param entity
     * @param system
     * @returns
     */
    CheckEntitySystem(entity, system) {
        var _a, _b;
        const container = this.entities.get(entity);
        const requireComponents = system.requireComponents;
        if (container === null || container === void 0 ? void 0 : container.HasAllComponents(requireComponents)) {
            (_a = this.systems.get(system)) === null || _a === void 0 ? void 0 : _a.add(entity);
        }
        else {
            (_b = this.systems.get(system)) === null || _b === void 0 ? void 0 : _b.delete(entity);
        }
        return;
    }
    /**
     * Checks if the entity satisfies any system requirements
     * @param entity
     */
    CheckEntity(entity) {
        for (const system of this.systems.keys()) {
            this.CheckEntitySystem(entity, system);
        }
    }
}
export {};
