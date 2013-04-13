using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RMLight.Models
{
    public class Customer
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public int LangaugeId { get; set; }
        public int Type { get; set; }
        public int Flags { get; set; }
        public DateTime? Created { get; set; }

        // TODO: May be it should be extendet with some "Settings" field

    }

    public class CheckResult
    {
        public bool Result { get; set; }
    }

}