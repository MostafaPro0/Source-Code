﻿using Qayimli.Core.Entities;
using Qayimli.Core.RepositoriesContract;
using Qayimli.Core.Specifications;
using Qayimli.Repository.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Qayimli.Repository
{
    public class GenericRepository<T> : IGenericRepository<T> where T : BaseEntity
    {
        private readonly StoreContext _dbContext;

        public GenericRepository(StoreContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IReadOnlyList<T>> GetAllAsync()
        {
            //if (typeof(T) == typeof(Product))
            //    return (IReadOnlyList<T>) await _dbContext.Set<Product>().Include(P => P.Brand).Include(P => P.Category).ToListAsync();

            return await _dbContext.Set<T>().ToListAsync();
        }

        public async Task<IReadOnlyList<T>> GetAllAsyncWithSpecAsync(ISpecifications<T> spec)
        {
            return await ApplySpec(spec).ToListAsync();
        }

        public async Task<T?> GetAsync(int id)
        {
            //if (typeof(T) == typeof(Product))
            //    return await _dbContext.Set<Product>().Where(P=> P.Id==id).Include(P => P.Brand).Include(P => P.Category).FirstOrDefaultAsync()as T; 
            return await _dbContext.Set<T>().FindAsync(id);
        }

        public async Task<T?> GetEntityWithSpecAsync(ISpecifications<T> spec)
        {
            return await ApplySpec(spec).FirstOrDefaultAsync();
        }

        public async Task<int?> GetCountAsyncWithSpecAsync(ISpecifications<T> spec)
        {
            return await ApplySpec(spec).CountAsync();
        }

        private IQueryable<T> ApplySpec(ISpecifications<T> spec)
        {
            return SpecificationsEvaluator<T>.GetQuery(_dbContext.Set<T>(), spec);
        }

        public async Task AddAsync(T entity) => await _dbContext.Set<T>().AddAsync(entity);

        public void Update(T entity) =>  _dbContext.Set<T>().Update(entity);

        public void Delete(T entity) =>  _dbContext.Set<T>().Remove(entity);
    }
}
