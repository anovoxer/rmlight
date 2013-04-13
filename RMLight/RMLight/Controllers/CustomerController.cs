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
    public class SecurityController : ApiController
    {
        public bool GetSecurity(string action)
        {
            switch (action)
            {
                case "logout":
                    System.Web.Security.FormsAuthentication.SignOut();
                    return true;
            }
            return false;
        }
    }


    public class CustomerController : ApiController
    {
        private RMLightContext db = new RMLightContext();

        // GET api/Customer
        public IEnumerable<Customer> GetCustomers()
        {
            return db.Customers.AsEnumerable();
        }

        public CheckResult GetCustomer(string login, string password)
        {
            Customer c = db.Customers.SingleOrDefault(customer => customer.Email == login && password == "123");
            CheckResult cr = new CheckResult();

            if (c != null)
            {
                System.Web.Security.FormsAuthentication.SetAuthCookie(login, true);
                cr.Result = true;
            }
            return cr;
            // TODO: Create User while Creating Customer. Then check here user in normal way, not customer.
        }

        public CheckResult GetCustomer(string name)
        {
            CheckResult cr = new CheckResult();
            cr.Result = db.Customers.SingleOrDefault(customer => customer.Name.ToLower() == name.ToLower()) == null; //.AsQueryable().Select(q => q.Name.ToLower().Equals(name.ToLower())).Count() > 0;

            return cr;
        }

        // GET api/Customer/5
        public Customer GetCustomer(int id)
        {
            Customer customer = db.Customers.Find(id);
            if (customer == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return customer;
        }

        // PUT api/Customer/5
        public HttpResponseMessage PutCustomer(int id, Customer customer)
        {
            if (ModelState.IsValid && id == customer.Id)
            {
                db.Entry(customer).State = EntityState.Modified;

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

        // POST api/Customer
        public HttpResponseMessage PostCustomer(Customer customer)
        {
            if (ModelState.IsValid)
            {
                db.Customers.Add(customer);
                db.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, customer);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = customer.Id }));
                return response;
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }

        // DELETE api/Customer/5
        public HttpResponseMessage DeleteCustomer(int id)
        {
            Customer customer = db.Customers.Find(id);
            if (customer == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            db.Customers.Remove(customer);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            return Request.CreateResponse(HttpStatusCode.OK, customer);
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}