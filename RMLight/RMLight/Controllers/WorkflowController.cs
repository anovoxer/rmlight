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
    public class WorkflowController : ApiController
    {
        private RMLightContext db = new RMLightContext();

        // GET api/Workflow
        public IEnumerable<Workflow> GetWorkflows()
        {
            return db.Workflows.AsEnumerable();
        }

        // GET api/Workflow/5
        public Workflow GetWorkflow(int id)
        {
            Workflow workflow = db.Workflows.Find(id);
            if (workflow == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return workflow;
        }

        // PUT api/Workflow/5
        public HttpResponseMessage PutWorkflow(int id, Workflow workflow)
        {
            if (ModelState.IsValid && id == workflow.Id)
            {
                db.Entry(workflow).State = EntityState.Modified;

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

        // POST api/Workflow
        public HttpResponseMessage PostWorkflow(Workflow workflow)
        {
            if (ModelState.IsValid)
            {
                db.Workflows.Add(workflow);
                db.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, workflow);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = workflow.Id }));
                return response;
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }

        // DELETE api/Workflow/5
        public HttpResponseMessage DeleteWorkflow(int id)
        {
            Workflow workflow = db.Workflows.Find(id);
            if (workflow == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            db.Workflows.Remove(workflow);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            return Request.CreateResponse(HttpStatusCode.OK, workflow);
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}