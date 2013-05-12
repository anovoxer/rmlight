using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RMLight.Models
{
    public class StateInfo
    {
        public DateTime? Created { get; set; }
        public int OwnerId { get; set; }
        public int State { get; set; }
        public int CustomerId { get; set; }
    }

}