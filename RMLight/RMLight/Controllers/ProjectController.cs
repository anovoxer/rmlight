using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using RMLight.Models;

namespace RMLight.Controllers
{
    public class ProjectController : ApiController
    {
        private RMLightContext db = new RMLightContext();

        // GET api/Project
        //public IEnumerable<Project> GetProjects()
        //{
        //    return db.Projects.AsEnumerable();
        //}

        public Object GetProjectsCount(bool returncount, string q = null, string sort = null, bool desc = false, int? limit = null, int offset = 0)
        {
            var list = ((IObjectContextAdapter)db).ObjectContext.CreateObjectSet<Project>();

            IQueryable<Project> items = list;//string.IsNullOrEmpty(sort) ? list.OrderBy(o => o.Id) : list.OrderBy(String.Format("it.{0} {1}", sort, desc ? "DESC" : "ASC"));
            if (!string.IsNullOrEmpty(q) && q != "undefined") items = items.Where(t => t.Name.Contains(q) || t.JobDescription.Contains(q) || t.Header.Contains(q));

            return new { Count = Math.Ceiling(items.Count() / ((decimal)(limit ?? 100))) };
        }

        public IEnumerable<Project> GetTodoItems(string q = null, string sort = null, bool desc = false, int? limit = null, int offset = 0)
        {
            var list = ((IObjectContextAdapter)db).ObjectContext.CreateObjectSet<Project>();

            IQueryable<Project> items = string.IsNullOrEmpty(sort) ? list.OrderBy(o => o.Id) : list.OrderBy(String.Format("it.{0} {1}", sort, desc ? "DESC" : "ASC"));
            if (!string.IsNullOrEmpty(q) && q != "undefined") items = items.Where(t => t.Name.Contains(q) || t.JobDescription.Contains(q) || t.Header.Contains(q));

            if (offset > 0) items = items.Skip(offset);
            if (limit.HasValue) items = items.Take(limit.Value);

            return items;
        }

        // GET api/Project/5
        public Project GetProject(int id)
        {
            Project project = db.Projects.Find(id);
            if (project == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return project;
        }

        // PUT api/Project/5
        public HttpResponseMessage PutProject(int id, Project project)
        {
            if (ModelState.IsValid && id == project.Id)
            {
                db.Entry(project).State = EntityState.Modified;

                try
                {
                    db.SaveChanges();
                }
                catch (DbUpdateConcurrencyException)
                {
                    return Request.CreateResponse(HttpStatusCode.NotFound);
                }

                return Request.CreateResponse(HttpStatusCode.OK);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }

        // POST api/Project
        public HttpResponseMessage PostProject(Project project)
        {
            if (ModelState.IsValid)
            {
                db.Projects.Add(project);
                db.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, project);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = project.Id }));
                return response;
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }

        // DELETE api/Project/5
        public HttpResponseMessage DeleteProject(int id)
        {
            Project project = db.Projects.Find(id);
            if (project == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            db.Projects.Remove(project);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            return Request.CreateResponse(HttpStatusCode.OK, project);
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}