using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace RMLight.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Phone { get; set; }
        public int Type { get; set; }
        public int Flags { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? Updated { get; set; }

        //[NotMappedAttribute]
        //public string FullName { get { return FirstName + " " + LastName; } }

        //public ??? Permissions { get; }
        // TODO think about security and permisions.
    }
}