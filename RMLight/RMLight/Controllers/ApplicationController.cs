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
    public class ApplicationController : ApiController
    {
        private RMLightContext db = new RMLightContext();

        // GET api/Application
        public IEnumerable<Application> GetApplications(string q, int projectId)
        {
            var list = ((IObjectContextAdapter)db).ObjectContext.CreateObjectSet<Application>();

            IQueryable<Application> items = list.AsQueryable().Where(i => i.ProjectId == projectId);
            //if (!string.IsNullOrEmpty(q) && q != "undefined") items = items.Where(t => t.Name.Contains(q) || t.JobDescription.Contains(q) || t.Header.Contains(q));

            //if (offset > 0) items = items.Skip(offset);
            //if (limit.HasValue) items = items.Take(limit.Value);

            return items;


            //return db.Applications.AsEnumerable();
        }

        // GET api/Application
        public IEnumerable<Application> GetApplications()
        {
            return db.Applications.AsEnumerable();
        }

        // GET api/Application/5
        public Application GetApplication(int id)
        {
            Application application = db.Applications.Find(id);
            if (application == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return application;
        }

        // PUT api/Application/5
        public HttpResponseMessage PutApplication(int id, Application application)
        {
            if (ModelState.IsValid && id == application.Id)
            {
                db.Entry(application).State = EntityState.Modified;

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

        // POST api/Application
        public HttpResponseMessage PostApplication(Application application)
        {
            if (ModelState.IsValid)
            {
                db.Applications.Add(application);
                db.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, application);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = application.Id }));
                return response;
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }

        // DELETE api/Application/5
        public HttpResponseMessage DeleteApplication(int id)
        {
            Application application = db.Applications.Find(id);
            if (application == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            db.Applications.Remove(application);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            return Request.CreateResponse(HttpStatusCode.OK, application);
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}