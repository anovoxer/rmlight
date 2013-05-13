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
    public class CandidateController : ApiController
    {
        private RMLightContext db = new RMLightContext();

        public HttpResponseMessage CreateApplication(int candidateId, int projectId)
        {
            Candidate candidate = db.Candidates.Find(candidateId);
            if (candidate == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            Application a = new Application()
            {
                Name = candidate.Name,
                Lastname = candidate.Lastname,
                Birthday = candidate.Birthday,
                Address = candidate.Address,
                Phone = candidate.Phone,
                Rating = candidate.Rating,
                Userpic = candidate.Userpic,

                ProjectId = projectId,
                CandidateId = candidate.Id,

                CustomerId = candidate.CustomerId,
                Created = DateTime.Now,
                Status = 1 // TODO: defined statuses and workflow for statuses.
            };

            try
            {

                db.Applications.Add(a);
                db.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, a);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = a.Id }));
                return response;
            }
            catch
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }

        // GET api/Candidate
        public IEnumerable<Candidate> GetCandidates()
        {
            return db.Candidates.AsEnumerable();
        }

        // GET api/Candidate/5
        public Candidate GetCandidate(int id)
        {
            Candidate candidate = db.Candidates.Find(id);
            if (candidate == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return candidate;
        }

        // PUT api/Candidate/5
        public HttpResponseMessage PutCandidate(int id, Candidate candidate)
        {
            if (ModelState.IsValid && id == candidate.Id)
            {
                db.Entry(candidate).State = EntityState.Modified;

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

        // POST api/Candidate
        public HttpResponseMessage PostCandidate(Candidate candidate)
        {
            if (ModelState.IsValid)
            {
                db.Candidates.Add(candidate);
                db.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, candidate);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = candidate.Id }));
                return response;
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }

        // DELETE api/Candidate/5
        public HttpResponseMessage DeleteCandidate(int id)
        {
            Candidate candidate = db.Candidates.Find(id);
            if (candidate == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            db.Candidates.Remove(candidate);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            return Request.CreateResponse(HttpStatusCode.OK, candidate);
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}