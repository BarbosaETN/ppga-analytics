'use strict';

class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async findById(id, options = {}) {
        return this.model.findByPk(id, options);
    }

    async findAll(options = {}) {
        return this.model.findAll(options);
    }

    async create(data, options = {}) {
        return this.model.create(data, options);
    }

    async update(data, options = {}) {
        const [affectedRows] = await this.model.update(
            data,
            options
        );

        return affectedRows;
    }

    async delete(options = {}) {
        return this.model.destroy(options);
    }
}

export default BaseRepository;