using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RMLight.Models
{
    public class Project : StateInfo
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Header { get; set; }
        public string JobDescription { get; set; }
        public int Area { get; set; }
        public int Category { get; set; }
    }
}